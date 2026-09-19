const SectionPagination = ({ number, title }) => {
  return (
    <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex flex-col items-end opacity-35 pointer-events-none select-none">
      <div 
        className="font-display font-bold text-4xl md:text-6xl text-transparent" 
        style={{ WebkitTextStroke: '1px var(--color-accent)' }}
      >
        {number}
      </div>
      <div className="font-mono text-xs text-[var(--color-accent-glow)] font-bold tracking-widest uppercase mt-1">
        {title}
      </div>
    </div>
  );
};

export default SectionPagination;
