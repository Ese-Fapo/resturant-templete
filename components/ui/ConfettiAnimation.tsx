import React, { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

const ConfettiAnimation: React.FC = () => {
  const [isExploding, setIsExploding] = useState(true);

  useEffect(() => {
    if (isExploding) {
      const timer = setTimeout(() => setIsExploding(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isExploding]);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      {isExploding && <ConfettiExplosion force={0.8} duration={3000} particleCount={200} width={window.innerWidth} />}
    </div>
  );
};

export default ConfettiAnimation;
