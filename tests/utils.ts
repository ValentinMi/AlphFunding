import {
  Address,
  ALPH_TOKEN_ID,
  groupOfAddress,
  isBase58,
  ONE_ALPH,
  stringToHex,
  waitForTxConfirmation,
  web3,
  ZERO_ADDRESS
} from "@alephium/web3";
import { getSigner, testAddress } from "@alephium/web3-test";
import { Pool, PoolInstance, PoolTypes } from "../artifacts/ts";
import { expect } from "vitest";
import { randomBytes } from "crypto";
import * as base58 from "bs58";


export enum ErrorCodes {
  CollectIsFinished = 0,
  GoalAlreadyReached = 1,
  CollectNotFinished = 2,
  NotTheBeneficiary = 3,
  NoContribution = 4,
  NotEnoughFunds = 5
}

web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
export const signer = await getSigner(alph(1000), 0)

export const defaultInitialFields: PoolTypes.Fields =   {
  name: stringToHex("Test Pool"),
  description: stringToHex("Test Pool Description"),
  creator: ZERO_ADDRESS,
  beneficiary: ZERO_ADDRESS,
  goal: alph(100),
  end: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 7),
  totalCollected: 0n
}

export async function deployPool(initialFields?: PoolTypes.Fields) {
  return await Pool.deploy(signer, {
    initialFields: initialFields || defaultInitialFields,
  })
}

export function alph(amount: bigint | number): bigint {
  return BigInt(amount) * ONE_ALPH
}

export async function getTotalCollected(pool: PoolInstance) {
  return (await pool.view.getTotalCollected()).returns
}

export async function balanceOf(tokenId: string, address = testAddress): Promise<bigint> {
  const balances = await web3.getCurrentNodeProvider().addresses.getAddressesAddressBalance(address)
  if (tokenId === ALPH_TOKEN_ID) return BigInt(balances.balance)
  const balance = balances.tokenBalances?.find((t) => t.id === tokenId)
  return balance === undefined ? 0n : BigInt(balance.amount)
}

// Rewrite the function with vitest expect
export async function expectAssertionError(
  p: Promise<unknown>,
  address: string,
  errorCode: number | bigint
): Promise<void> {
  expect(isBase58(address)).toEqual(true)
  await expect(p).rejects.toThrowError(
    new RegExp(`Assertion Failed in Contract @ ${address}, Error Code: ${errorCode}`, 'mg')
  )
}

export function randomP2PKHAddress(groupIndex = 0): string {
  const prefix = Buffer.from([0x00])
  const bytes = Buffer.concat([prefix, randomBytes(32)])
  const address = (base58 as any).encode(bytes)
  if (groupOfAddress(address) === groupIndex) {
    return address
  }
  return randomP2PKHAddress(groupIndex)
}

async function waitTxConfirmed<T extends { txId: string }>(promise: Promise<T>): Promise<T> {
  const result = await promise
  await waitForTxConfirmation(result.txId, 1, 1000)
  return result
}

export async function transferAlphTo(to: Address, amount: bigint) {
  return await waitTxConfirmed(
    signer.signAndSubmitTransferTx({
      signerAddress: signer.address,
      destinations: [{ address: to, attoAlphAmount: amount }]
    })
  )
}
