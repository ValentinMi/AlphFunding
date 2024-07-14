import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

interface CountdownProps {
  targetDate: Date;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );

        setTimeRemaining({ days, hours });
      } else {
        setTimeRemaining({ days: 0, hours: 0 });
      }
    };

    calculateTimeRemaining();
    const intervalId = setInterval(calculateTimeRemaining, 3600000); // Update every hour

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <Box>
      <Text>
        {timeRemaining.days}d {timeRemaining.hours}h
      </Text>
    </Box>
  );
};
