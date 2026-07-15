
const SectionPagination = ({ number, title }) => {
  return (
    <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex flex-col items-end opacity-40 pointer-events-none select-none">
      {/* Outline number using emerald green stroke */}
      <div 
        className="font-display font-bold text-4xl md:text-6xl text-transparent" 
        style={{ WebkitTextStroke: '1px #00C853' }}
      >
        {number}
      </div>
      {/* Label */}
      <div className="font-mono text-accent text-xs tracking-[0.15em] uppercase mt-2">
        {title}
      </div>
    </div>
  );
};

export default SectionPagination;
