import { assert, beforeEach, describe, expect, it } from "vitest";
import {
  balanceOf,
  defaultInitialFields,
  deployPool,
  ErrorCodes,
  expectAssertionError,
  getTotalCollected,
  randomP2PKHAddress,
  signer,
} from "../utils";
import { Contribute, PoolInstance, Refund, Withdraw } from "../../artifacts/ts";
import {
  ALPH_TOKEN_ID,
  convertAlphAmountWithDecimals,
  sleep,
  ZERO_ADDRESS,
} from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { testPrivateKey } from "@alephium/web3-test";

describe("Pool", async () => {
  let pool: PoolInstance;

  beforeEach(async () => {
    pool = (await deployPool()).contractInstance;
  });

  describe("Contribute", () => {
    it("should revert CollectIsFinished when contributing after the end", async () => {
      pool = (
        await deployPool({
          ...defaultInitialFields,
          end: BigInt(Date.now() - 1000),
        })
      ).contractInstance;

      const contributePromise = Contribute.execute(signer, {
        initialFields: {
          pool: pool.address,
          amount: convertAlphAmountWithDecimals(10)!,
        },
        attoAlphAmount: convertAlphAmountWithDecimals(11), // +1 for map deposit
      });

      await expectAssertionError(
        contributePromise,
        pool.address,
        ErrorCodes.CollectIsFinished,
      );
    });

    it("should revert NotEnoughFunds when contributing after the end", async () => {
      const contributePromise = Contribute.execute(signer, {
        initialFields: {
          pool: pool.address,
          amount: 0n,
        },
        attoAlphAmount: 0n,
      });

      await expectAssertionError(
        contributePromise,
        pool.address,
        ErrorCodes.NotEnoughFunds,
      );
    });

    it("should contribute to the pool and emit Contribute event", async () => {
      await Contribute.execute(signer, {
        initialFields: {
          pool: pool.address,
          amount: convertAlphAmountWithDecimals(10)!,
        },
        attoAlphAmount: convertAlphAmountWithDecimals(11), // +1 for map deposit
      });

      const totalCollected = await getTotalCollected(pool);
      assert(totalCollected === convertAlphAmountWithDecimals(10));

      const { events } =
        await signer.nodeProvider.events.getEventsContractContractaddress(
          pool.address,
          { start: 0 },
        );
      expect(events[0].eventIndex).toEqual(0);
      expect(events[0].fields).toEqual([
        { type: "Address", value: signer.address },
        { type: "U256", value: convertAlphAmountWithDecimals(10)!.toString() },
        { type: "U256", value: convertAlphAmountWithDecimals(10)!.toString() },
      ]);
    });
  });

  describe("Refund", () => {
    it("should revert CollectIsFinished when refunding after the end", async () => {
      pool = (
        await deployPool({
          ...defaultInitialFields,
          end: BigInt(Date.now() - 1000),
        })
      ).contractInstance;

      const refundPromise = Refund.execute(signer, {
        initialFields: {
          pool: pool.address,
        },
      });

      await expectAssertionError(
        refundPromise,
        pool.address,
        ErrorCodes.CollectIsFinished,
      );
    });

    it("should revert GoalAlreadyReached when refunding while pool goal is reached", async () => {
      pool = (
        await deployPool({
          ...defaultInitialFields,
          totalCollected: convertAlphAmountWithDecimals(100)!,
        })
      ).contractInstance;

      const refundPromise = Refund.execute(signer, {
        initialFields: {
          pool: pool.address,
        },
      });

      await expectAssertionError(
        refundPromise,
        pool.address,
        ErrorCodes.GoalAlreadyReached,
      );
    });

    it("should revert NoContribution when refunding without previous contribution", async () => {
      const refundPromise = Refund.execute(signer, {
        initialFields: {
          pool: pool.address,
        },
      });

      await expectAssertionError(
        refundPromise,
        pool.address,
        ErrorCodes.NoContribution,
      );
    });

    it("should refund the contribution", async () => {
      await Contribute.execute(signer, {
        initialFields: {
          pool: pool.address,
          amount: convertAlphAmountWithDecimals(10)!,
        },
        attoAlphAmount: convertAlphAmountWithDecimals(11), // +1 for map deposit
      });

      const balanceBeforeRefund = await balanceOf(
        ALPH_TOKEN_ID,
        signer.address,
      );

      await Refund.execute(signer, {
        initialFields: {
          pool: pool.address,
        },
      });

      const balanceAfterRefund = await balanceOf(ALPH_TOKEN_ID, signer.address);

      assert(balanceAfterRefund > balanceBeforeRefund);
      const totalCollected = await getTotalCollected(pool);
      assert(totalCollected === convertAlphAmountWithDecimals(0));
    });
  });

  describe("Withdraw", () => {
    it("should revert NotTheBeneficiary if the caller is not the beneficiary", async () => {
      pool = (
        await deployPool({
          ...defaultInitialFields,
          end: BigInt(Date.now() - 1000),
          totalCollected: convertAlphAmountWithDecimals(100)!,
        })
      ).contractInstance;

      const withdrawPromise = Withdraw.execute(signer, {
        initialFields: {
          pool: pool.address,
        },
      });

      await expectAssertionError(
        withdrawPromise,
        pool.address,
        ErrorCodes.NotTheBeneficiary,
      );
    });

    it("should revert CollectNotFinished when withdrawing before the end", async () => {
      pool = (
        await deployPool({
          ...defaultInitialFields,
          end: BigInt(Date.now() + 1000),
          creator: signer.address,
          beneficiary: signer.address,
        })
      ).contractInstance;

      const withdrawPromise = Withdraw.execute(signer, {
        initialFields: {
          pool: pool.address,
        },
      });

      await expectAssertionError(
        withdrawPromise,
        pool.address,
        ErrorCodes.CollectNotFinished,
      );
    });

    it("should withdraw the funds to beneficiary if the caller is the creator", async () => {
      const beneficiary = randomP2PKHAddress();

      pool = (
        await deployPool({
          ...defaultInitialFields,
          end: BigInt(Date.now() + 500),
          creator: signer.address,
          beneficiary: beneficiary,
          totalCollected: convertAlphAmountWithDecimals(100)!,
        })
      ).contractInstance;

      await Contribute.execute(signer, {
        initialFields: {
          pool: pool.address,
          amount: convertAlphAmountWithDecimals(100)!,
        },
        attoAlphAmount: convertAlphAmountWithDecimals(101), // +1 for map deposit
      });

      await sleep(600);

      await Withdraw.execute(signer, {
        initialFields: {
          pool: pool.address,
        },
      });

      const beneficiaryBalance = await balanceOf(ALPH_TOKEN_ID, beneficiary);
      assert(beneficiaryBalance === convertAlphAmountWithDecimals(100.1)); // add 0.1 ALPH for the minimal deposit transfer on destroy
    });

    it("should withdraw the funds to beneficiary if the caller is the beneficiary", async () => {
      const beneficiarySigner = new PrivateKeyWallet({
        privateKey: testPrivateKey,
      });

      const balanceOfBeneficiaryBefore = await balanceOf(
        ALPH_TOKEN_ID,
        beneficiarySigner.address,
      );

      pool = (
        await deployPool({
          ...defaultInitialFields,
          end: BigInt(Date.now() + 500),
          creator: ZERO_ADDRESS,
          beneficiary: beneficiarySigner.address,
          totalCollected: convertAlphAmountWithDecimals(100)!,
        })
      ).contractInstance;

      await Contribute.execute(signer, {
        initialFields: {
          pool: pool.address,
          amount: convertAlphAmountWithDecimals(100)!,
        },
        attoAlphAmount: convertAlphAmountWithDecimals(101), // +1 for map deposit
      });

      await sleep(600);

      await Withdraw.execute(beneficiarySigner, {
        initialFields: {
          pool: pool.address,
        },
      });

      const balanceOfBeneficiaryAfter = await balanceOf(
        ALPH_TOKEN_ID,
        beneficiarySigner.address,
      );

      assert(balanceOfBeneficiaryBefore < balanceOfBeneficiaryAfter);
    });

    it("should destroy the contract after withdraw", async () => {
      const beneficiary = randomP2PKHAddress();

      pool = (
        await deployPool({
          ...defaultInitialFields,
          end: BigInt(Date.now() + 500),
          creator: signer.address,
          beneficiary: beneficiary,
          totalCollected: convertAlphAmountWithDecimals(100)!,
        })
      ).contractInstance;

      await Contribute.execute(signer, {
        initialFields: {
          pool: pool.address,
          amount: convertAlphAmountWithDecimals(100)!,
        },
        attoAlphAmount: convertAlphAmountWithDecimals(101)!, // +1 for map deposit
      });

      await sleep(600);

      await Withdraw.execute(signer, {
        initialFields: {
          pool: pool.address,
        },
      });

      try {
        await Contribute.execute(signer, {
          initialFields: {
            pool: pool.address,
            amount: convertAlphAmountWithDecimals(100)!,
          },
          attoAlphAmount: convertAlphAmountWithDecimals(101), // +1 for map deposit
        });
      } catch (e: any) {
        expect(e.message).toContain(`Contract ${pool.address} does not exist`);
      }
    });
  });
});
