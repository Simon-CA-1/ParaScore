import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, Gamepad2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState('NFS');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [prevWinner, setPrevWinner] = useState(null);

  const games = [
    { id: 'NFS', name: 'NFS', scoreType: 'time' },
    { id: 'ALTOS', name: 'Altos Adventure', scoreType: 'score' },
    { id: 'ULTRAKILL', name: 'ULTRAKILL', scoreType: 'rank' }
  ];

  // Mock data - replace with actual API call
  const mockData = {
    NFS: [
      { rank: 1, name: 'SPEED_DEMON', srn: 'PES1234', score: '2:34:890' },
      { rank: 2, name: 'TURBO_RACER', srn: 'PES5678', score: '2:41:450' },
      { rank: 3, name: 'NEON_DRIFT', srn: 'PES9012', score: '2:47:230' },
      { rank: 4, name: 'CYBER_PILOT', srn: 'PES3456', score: '2:53:160' },
      { rank: 5, name: 'VOLT_RIDER', srn: 'PES7890', score: '3:02:920' }
    ],
    ALTOS: [
      { rank: 1, name: 'SKY_WALKER', srn: 'PES2468', score: 45300 },
      { rank: 2, name: 'CLOUD_JUMPER', srn: 'PES1357', score: 42150 },
      { rank: 3, name: 'ALTO_MASTER', srn: 'PES9753', score: 38970 },
      { rank: 4, name: 'WIND_RIDER', srn: 'PES8642', score: 35840 },
      { rank: 5, name: 'PEAK_CLIMBER', srn: 'PES7531', score: 32760 }
    ],
    ULTRAKILL: [
      { rank: 1, name: 'BLOOD_MACHINE', srn: 'PES2468', score: 'P' },
      { rank: 2, name: 'VIOLENCE_LAYER', srn: 'PES1357', score: 'S' },
      { rank: 3, name: 'GABRIEL_SLAYER', srn: 'PES9753', score: 'S' },
      { rank: 4, name: 'STYLE_MASTER', srn: 'PES8642', score: 'A' },
      { rank: 5, name: 'HELL_WALKER', srn: 'PES7531', score: 'A' }
    ]
  };

  useEffect(() => {
    const newData = mockData[activeGame] || [];
    const currentWinner = newData[0]?.name;
    
    // Only trigger confetti when there's actually a NEW leader (not just game switch)
    if (currentWinner && prevWinner && currentWinner !== prevWinner && leaderboardData.length > 0) {
      triggerConfetti();
    }
    
    setLeaderboardData(newData);
    setPrevWinner(currentWinner);
  }, [activeGame]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7B3FE4', '#FF4FD8', '#00E5FF']
    });
  };

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-[#E6E8FF] font-bold">{rank}</div>;
    }
  };

  const getRankGlow = (rank) => {
    switch (rank) {
      case 1:
        return 'shadow-[0_0_20px_rgba(255,215,0,0.7)]';
      case 2:
        return 'shadow-[0_0_15px_rgba(192,192,192,0.7)]';
      case 3:
        return 'shadow-[0_0_15px_rgba(205,127,50,0.7)]';
      default:
        return '';
    }
  };

  const AnimatedScore = ({ score, scoreType, delay = 0 }) => {
    const [displayScore, setDisplayScore] = useState(scoreType === 'score' ? 0 : score);

    useEffect(() => {
      if (scoreType === 'score') {
        const timer = setTimeout(() => {
          let start = 0;
          const increment = score / 50;
          const counter = setInterval(() => {
            start += increment;
            if (start >= score) {
              setDisplayScore(score);
              clearInterval(counter);
            } else {
              setDisplayScore(Math.floor(start));
            }
          }, 30);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setDisplayScore(score);
      }
    }, [score, scoreType, delay]);

    if (scoreType === 'score') {
      return <span>{displayScore.toLocaleString()}</span>;
    } else if (scoreType === 'rank') {
      const rankColors = {
        'P': 'text-yellow-400',
        'S': 'text-green-400', 
        'A': 'text-blue-400',
        'B': 'text-purple-400',
        'C': 'text-orange-400',
        'D': 'text-red-400'
      };
      return <span className={`font-bold text-2xl ${rankColors[score] || 'text-gray-400'}`}>{displayScore}</span>;
    } else {
      return <span className="font-mono">{displayScore}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F2F] via-[#0F1B4A] to-[#0B0F2F] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(123,63,228,0.1) 25%, rgba(123,63,228,0.1) 26%, transparent 27%, transparent 74%, rgba(123,63,228,0.1) 75%, rgba(123,63,228,0.1) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(123,63,228,0.1) 25%, rgba(123,63,228,0.1) 26%, transparent 27%, transparent 74%, rgba(123,63,228,0.1) 75%, rgba(123,63,228,0.1) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 p-4 min-h-screen">
        {/* Header */}
        <motion.div 
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-[#00E5FF] hover:text-[#FF4FD8] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-semibold">Back</span>
            </motion.button>
          </div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] mb-2"
            style={{ fontFamily: 'Orbitron, monospace' }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            LIVE ARCADE LEADERBOARD
          </motion.h1>
          <div className="text-center text-[#00E5FF] font-semibold">
            <Gamepad2 className="w-6 h-6 inline mr-2" />
            Real-time Rankings
          </div>
        </motion.div>

        {/* Main leaderboard panel */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div 
            className="bg-[#151A3F] rounded-2xl border-2 border-[#7B3FE4] overflow-hidden relative"
            style={{
              boxShadow: `
                0 0 40px rgba(123,63,228,0.7),
                inset 0 0 40px rgba(123,63,228,0.1)
              `
            }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#00E5FF] rounded-tl-2xl opacity-50" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#00E5FF] rounded-tr-2xl opacity-50" />

            {/* Game selector tabs */}
            <div className="p-6 border-b-2 border-[#7B3FE4]/30">
              <div className="flex justify-center space-x-1 bg-[#0B0F2F]/50 rounded-lg p-2">
                {games.map((game) => (
                  <motion.button
                    key={game.id}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all text-sm ${
                      activeGame === game.id
                        ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] text-white shadow-[0_0_20px_rgba(123,63,228,0.7)]'
                        : 'text-[#E6E8FF] hover:text-[#FF4FD8] hover:bg-[#7B3FE4]/20'
                    }`}
                    onClick={() => setActiveGame(game.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {game.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Leaderboard header */}
            <div className="px-6 py-4 bg-[#0B0F2F]/30 border-b border-[#7B3FE4]/30">
              <div className="grid grid-cols-12 gap-4 text-[#00E5FF] font-semibold text-sm uppercase tracking-wider">
                <div className="col-span-2 text-center">Rank</div>
                <div className="col-span-4">Player Name</div>
                <div className="col-span-3">SRN</div>
                <div className="col-span-3 text-right">
                  {activeGame === 'NFS' ? 'Time' : activeGame === 'ULTRAKILL' ? 'Rank' : 'Score'}
                </div>
              </div>
            </div>

            {/* Leaderboard entries */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {leaderboardData.map((player, index) => (
                  <motion.div
                    key={`${activeGame}-${player.rank}`}
                    className={`grid grid-cols-12 gap-4 py-4 px-4 mb-3 rounded-lg bg-[#0B0F2F]/50 border border-[#7B3FE4]/30 hover:border-[#FF4FD8]/50 transition-all ${getRankGlow(player.rank)}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 0 25px rgba(123,63,228,0.5)"
                    }}
                  >
                    {/* Rank with medal */}
                    <div className="col-span-2 flex items-center justify-center">
                      <motion.div 
                        className="flex items-center justify-center"
                        animate={player.rank <= 3 ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {getMedalIcon(player.rank)}
                      </motion.div>
                    </div>

                    {/* Player name */}
                    <div className="col-span-4 flex items-center">
                      <span className="text-[#E6E8FF] font-bold text-lg">
                        {player.name}
                      </span>
                    </div>

                    {/* SRN */}
                    <div className="col-span-3 flex items-center">
                      <span className="text-[#00E5FF] font-mono">
                        {player.srn}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="col-span-3 flex items-center justify-end">
                      <span className="text-[#FF4FD8] font-bold text-xl">
                        <AnimatedScore 
                          score={player.score} 
                          scoreType={games.find(g => g.id === activeGame)?.scoreType || 'score'} 
                          delay={index * 100} 
                        />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pulsing scanline effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7B3FE4] to-transparent opacity-5 h-2"
              animate={{ y: [0, 400, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Footer info */}
        <motion.div 
          className="max-w-4xl mx-auto mt-8 text-center text-[#E6E8FF]/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-sm">
            Rankings update in real-time • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;