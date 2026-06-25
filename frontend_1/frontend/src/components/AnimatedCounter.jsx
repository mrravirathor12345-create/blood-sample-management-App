import React from 'react';
import CountUp from 'react-countup';

const AnimatedCounter = ({ value, suffix = '', className = '' }) => (
  <span className={className}>
    <CountUp end={value} duration={1.8} separator="," suffix={suffix} />
  </span>
);

export default AnimatedCounter;
