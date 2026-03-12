import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertTriangle, ArrowLeft, Gamepad2, User, Hash, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubmitScore = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    playerName: '',
    srn: '',
    game: 'ALTOS', // Auto-select Altos Adventure for direct input
    score: '',
    minutes: '',
    seconds: '',
    milliseconds: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCheaterWarning, setShowCheaterWarning] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const games = [
    { id: 'NFS', name: 'Need for Speed', inputType: 'time' },
    { id: 'ALTOS', name: 'Altos Adventure', inputType: 'score' },
    { id: 'ULTRAKILL', name: 'ULTRAKILL', inputType: 'rank' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Format the score based on game type
    const game = getCurrentGame();
    let finalScore = formData.score;
    
    if (game?.inputType === 'time') {
      // Format as MM:SS:mmm
      const minutes = String(formData.minutes).padStart(2, '0');
      const seconds = String(formData.seconds).padStart(2, '0'); 
      const milliseconds = String(formData.milliseconds).padStart(3, '0');
      finalScore = `${minutes}:${seconds}:${milliseconds}`;
    }
    
    console.log('Submitting:', {
      ...formData,
      finalScore,
      gameType: game?.inputType
    });
    
    // Simulate API call
    setTimeout(() => {
      // Cheater detection based on game-specific thresholds
      let isCheater = false;
      
      if (game?.inputType === 'time') {
        // NFS: Check if time is less than 2:26.000 (impossibly fast)
        const totalMs = (parseInt(formData.minutes) * 60 * 1000) + 
                       (parseInt(formData.seconds) * 1000) + 
                       parseInt(formData.milliseconds);
        const thresholdMs = 2 * 60 * 1000 + 26 * 1000; // 2:26.000 in milliseconds
        if (totalMs < thresholdMs) {
          isCheater = true;
        }
      } else if (game?.inputType === 'score') {
        // Altos Adventure: Check if score is greater than 50,000
        const scoreValue = parseInt(formData.score);
        if (scoreValue > 50000) {
          isCheater = true;
        }
      } else if (game?.inputType === 'rank') {
        // ULTRAKILL: Check if rank is P (impossibly perfect)
        if (formData.score === 'P') {
          isCheater = true;
        }
      }
      
      if (isCheater) {
        setShowCheaterWarning(true);
        setTimeout(() => setShowCheaterWarning(false), 4000);
      } else {
        // Store the submitted data for display
        setSubmittedData({
          playerName: formData.playerName,
          srn: formData.srn,
          game: game?.name || 'Unknown Game',
          score: finalScore,
          gameType: game?.inputType
        });
        setSubmitSuccess(true);
        
        // Reload the form after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
          setSubmittedData(null);
          // Reset form
          setFormData({
            playerName: '',
            srn: '',
            game: 'ALTOS',
            score: '',
            minutes: '',
            seconds: '',
            milliseconds: ''
          });
        }, 3000);
      }
      setIsSubmitting(false);
    }, 2000);
  };

  const getCurrentGame = () => games.find(g => g.id === formData.game);
  
  const getScoreLabel = () => {
    const game = getCurrentGame();
    if (!game) return 'Score';
    switch (game.inputType) {
      case 'time': return 'Race Time';
      case 'rank': return 'Performance Rank';
      default: return 'Score';
    }
  };
  
  const isFormValid = () => {
    const game = getCurrentGame();
    const baseValid = formData.playerName && formData.srn && formData.game;
    
    if (!baseValid) return false;
    
    switch (game?.inputType) {
      case 'time':
        return formData.minutes && formData.seconds && formData.milliseconds;
      case 'rank':
        return formData.score; // For ranks, score field holds the rank
      default:
        return formData.score;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F2F] via-[#0F1B4A] to-[#0B0F2F] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(123,63,228,0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,79,216,0.3) 0%, transparent 50%)
            `
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({length: 15}, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00E5FF] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 min-h-screen flex items-center justify-center">
        {/* Back button */}
        <motion.button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center space-x-2 text-[#00E5FF] hover:text-[#FF4FD8] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-semibold">Back</span>
        </motion.button>

        {/* Main form panel */}
        <motion.div 
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div 
            className="bg-[#151A3F] rounded-2xl p-8 border-2 border-[#7B3FE4] relative overflow-hidden"
            style={{
              boxShadow: `
                0 0 40px rgba(123,63,228,0.7),
                inset 0 0 40px rgba(123,63,228,0.1)
              `
            }}
          >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#00E5FF] rounded-tl-2xl opacity-60" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#00E5FF] rounded-tr-2xl opacity-60" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#00E5FF] rounded-bl-2xl opacity-60" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#00E5FF] rounded-br-2xl opacity-60" />

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 
                className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] mb-2"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                SUBMIT SCORE
              </h1>
              <p className="text-[#00E5FF] flex items-center justify-center space-x-2">
                <Gamepad2 className="w-5 h-5" />
                <span>Enter your arcade achievement</span>
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Player Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-[#E6E8FF] text-sm font-semibold mb-2 flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#00E5FF]" />
                  <span>Player Name</span>
                </label>
                <input
                  type="text"
                  name="playerName"
                  value={formData.playerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0B0F2F] border-2 border-[#7B3FE4]/50 rounded-lg text-[#E6E8FF] placeholder-[#E6E8FF]/50 focus:border-[#FF4FD8] focus:outline-none transition-colors"
                  style={{
                    boxShadow: "inset 0 0 10px rgba(123,63,228,0.2)"
                  }}
                  placeholder="Enter your gaming alias"
                  required
                />
              </motion.div>

              {/* SRN */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-[#E6E8FF] text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-[#00E5FF]" />
                  <span>SRN</span>
                </label>
                <input
                  type="text"
                  name="srn"
                  value={formData.srn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0B0F2F] border-2 border-[#7B3FE4]/50 rounded-lg text-[#E6E8FF] placeholder-[#E6E8FF]/50 focus:border-[#FF4FD8] focus:outline-none transition-colors font-mono"
                  style={{
                    boxShadow: "inset 0 0 10px rgba(123,63,228,0.2)"
                  }}
                  placeholder="PES1234"
                  required
                />
              </motion.div>

              {/* Game Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-[#E6E8FF] text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Gamepad2 className="w-4 h-4 text-[#00E5FF]" />
                  <span>Game</span>
                </label>
                <select
                  name="game"
                  value={formData.game}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0B0F2F] border-2 border-[#7B3FE4]/50 rounded-lg text-[#E6E8FF] focus:border-[#FF4FD8] focus:outline-none transition-colors cursor-pointer"
                  style={{
                    boxShadow: "inset 0 0 10px rgba(123,63,228,0.2)"
                  }}
                  required
                >
                  {games.map(game => (
                    <option key={game.id} value={game.id} className="bg-[#0B0F2F]">
                      {game.name}
                    </option>
                  ))}
                </select>
                {/* Game type indicator */}
                <div className="mt-2 text-xs text-[#00E5FF]">
                  {getCurrentGame()?.inputType === 'time' && (
                    <span>⏱️ Submit your race completion time</span>
                  )}
                  {getCurrentGame()?.inputType === 'rank' && (
                    <span>🏆 Select your performance rank</span>
                  )}
                  {getCurrentGame()?.inputType === 'score' && (
                    <span>📊 Enter your highest score</span>
                  )}
                </div>
              </motion.div>

              {/* Score/Time/Rank Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-[#E6E8FF] text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-[#00E5FF]" />
                  <span>{getScoreLabel()}</span>
                </label>
                
                {getCurrentGame()?.inputType === 'time' ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="number"
                        name="minutes"
                        value={formData.minutes}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 bg-[#0B0F2F] border-2 border-[#7B3FE4]/50 rounded-lg text-[#E6E8FF] placeholder-[#E6E8FF]/50 focus:border-[#FF4FD8] focus:outline-none transition-colors text-center font-mono text-xl"
                        style={{
                          boxShadow: "inset 0 0 10px rgba(123,63,228,0.2)"
                        }}
                        placeholder="MM"
                        min="0"
                        max="59"
                        required
                      />
                      <p className="text-xs text-[#00E5FF] text-center mt-1">Minutes</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        name="seconds"
                        value={formData.seconds}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 bg-[#0B0F2F] border-2 border-[#7B3FE4]/50 rounded-lg text-[#E6E8FF] placeholder-[#E6E8FF]/50 focus:border-[#FF4FD8] focus:outline-none transition-colors text-center font-mono text-xl"
                        style={{
                          boxShadow: "inset 0 0 10px rgba(123,63,228,0.2)"
                        }}
                        placeholder="SS"
                        min="0"
                        max="59"
                        required
                      />
                      <p className="text-xs text-[#00E5FF] text-center mt-1">Seconds</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        name="milliseconds"
                        value={formData.milliseconds}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 bg-[#0B0F2F] border-2 border-[#7B3FE4]/50 rounded-lg text-[#E6E8FF] placeholder-[#E6E8FF]/50 focus:border-[#FF4FD8] focus:outline-none transition-colors text-center font-mono text-xl"
                        style={{
                          boxShadow: "inset 0 0 10px rgba(123,63,228,0.2)"
                        }}
                        placeholder="MMM"
                        min="0"
                        max="999"
                        required
                      />
                      <p className="text-xs text-[#00E5FF] text-center mt-1">Milliseconds</p>
                    </div>
                  </div>
                ) : getCurrentGame()?.inputType === 'rank' ? (
                  <select
                    name="score"
                    value={formData.score}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0B0F2F] border-2 border-[#7B3FE4]/50 rounded-lg text-[#E6E8FF] focus:border-[#FF4FD8] focus:outline-none transition-colors cursor-pointer text-center font-bold text-2xl"
                    style={{
                      boxShadow: "inset 0 0 10px rgba(123,63,228,0.2)"
                    }}
                    required
                  >
                    <option value="">Select Rank</option>
                    <option value="P" className="bg-[#0B0F2F] text-yellow-400">P - PERFECT</option>
                    <option value="S" className="bg-[#0B0F2F] text-green-400">S - SUPREME</option>
                    <option value="A" className="bg-[#0B0F2F] text-blue-400">A - AWESOME</option>
                    <option value="B" className="bg-[#0B0F2F] text-purple-400">B - BRUTAL</option>
                    <option value="C" className="bg-[#0B0F2F] text-orange-400">C - CRUEL</option>
                    <option value="D" className="bg-[#0B0F2F] text-red-400">D - DESTRUCTIVE</option>
                  </select>
                ) : (
                  <input
                    type="number"
                    name="score"
                    value={formData.score}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0B0F2F] border-2 border-[#7B3FE4]/50 rounded-lg text-[#E6E8FF] placeholder-[#E6E8FF]/50 focus:border-[#FF4FD8] focus:outline-none transition-colors text-right font-mono text-xl"
                    style={{
                      boxShadow: "inset 0 0 10px rgba(123,63,228,0.2)"
                    }}
                    placeholder="0"
                    min="0"
                    required
                  />
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg relative overflow-hidden transition-all ${
                    isFormValid() && !isSubmitting
                      ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] text-white cursor-pointer'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{
                    boxShadow: isFormValid() && !isSubmitting ? "0 0 30px rgba(123,63,228,0.7)" : "none"
                  }}
                  whileHover={isFormValid() && !isSubmitting ? { 
                    scale: 1.02,
                    boxShadow: "0 0 40px rgba(123,63,228,0.9)"
                  } : {}}
                  whileTap={isFormValid() && !isSubmitting ? { scale: 0.98 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="submitting"
                        className="flex items-center justify-center space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Submitting...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="submit"
                        className="flex items-center justify-center space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Send className="w-5 h-5" />
                        <span>SUBMIT SCORE</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Button glow effect */}
                  {isFormValid() && !isSubmitting && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Scanline effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7B3FE4] to-transparent opacity-5 h-1"
              animate={{ y: [0, 300, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Cheater Warning Modal */}
      <AnimatePresence>
        {showCheaterWarning && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-red-900/90 border-2 border-red-500 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
              initial={{ scale: 0.5, rotateY: 180 }}
              animate={{ 
                scale: 1, 
                rotateY: 0,
              }}
              exit={{ scale: 0.5, rotateY: 180 }}
              style={{
                boxShadow: "0 0 50px rgba(239,68,68,0.8)"
              }}
            >
              {/* Glitch effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-50"
                animate={{
                  x: [-100, 100, -100],
                  skewX: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <div className="relative z-10">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                </motion.div>
                
                <motion.h2 
                  className="text-2xl font-bold text-red-100 mb-2"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(239,68,68,0.8)",
                      "0 0 20px rgba(239,68,68,1)", 
                      "0 0 10px rgba(239,68,68,0.8)"
                    ]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⚠️ CHEATER DETECTED
                </motion.h2>
                
                <p className="text-red-200 mb-4">
                  Suspicious score detected. Please submit a legitimate score.
                </p>
                
                <motion.div 
                  className="text-xs text-red-300 font-mono"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  SECURITY BREACH • CODE: 0x404
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {submitSuccess && submittedData && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#151A3F] border-2 border-[#00E5FF] rounded-2xl p-8 max-w-lg w-full text-center relative overflow-hidden"
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              style={{
                boxShadow: "0 0 50px rgba(0,229,255,0.8)"
              }}
            >
              {/* Animated trophy */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <Trophy className="w-16 h-16 text-[#00E5FF] mx-auto mb-4" />
              </motion.div>
              
              {/* Success message */}
              <h2 className="text-2xl font-bold text-[#E6E8FF] mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
                SCORE SUBMITTED!
              </h2>
              
              {/* Submitted data display */}
              <div className="bg-[#0B0F2F]/50 rounded-lg p-4 mb-4 border border-[#7B3FE4]/30">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[#00E5FF] font-semibold">Player:</span>
                    <span className="text-[#E6E8FF]">{submittedData.playerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00E5FF] font-semibold">SRN:</span>
                    <span className="text-[#E6E8FF] font-mono">{submittedData.srn}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00E5FF] font-semibold">Game:</span>
                    <span className="text-[#E6E8FF]">{submittedData.game}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00E5FF] font-semibold">
                      {submittedData.gameType === 'time' ? 'Time:' : 
                       submittedData.gameType === 'rank' ? 'Rank:' : 'Score:'}
                    </span>
                    <span className={`font-bold text-xl ${
                      submittedData.gameType === 'rank' ? {
                        'P': 'text-yellow-400',
                        'S': 'text-green-400', 
                        'A': 'text-blue-400',
                        'B': 'text-purple-400',
                        'C': 'text-orange-400',
                        'D': 'text-red-400'
                      }[submittedData.score] || 'text-[#FF4FD8]' : 'text-[#FF4FD8]'
                    }`}>
                      {submittedData.gameType === 'time' ? (
                        <span className="font-mono">{submittedData.score}</span>
                      ) : submittedData.gameType === 'rank' ? (
                        <span>{submittedData.score}</span>
                      ) : (
                        <span>{parseInt(submittedData.score).toLocaleString()}</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Loading indicator */}
              <div className="flex items-center justify-center space-x-2 text-[#00E5FF]">
                <motion.div
                  className="w-2 h-2 bg-[#00E5FF] rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-[#00E5FF] rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-[#00E5FF] rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
                <span className="ml-2 text-sm">Returning to form...</span>
              </div>

              {/* Glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00E5FF] to-transparent opacity-10 h-1"
                animate={{ y: [0, 200, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmitScore;