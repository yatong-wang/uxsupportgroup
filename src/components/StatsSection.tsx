const StatsSection = () => {
  return (
    <section className="py-24 gradient-stats">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="text-5xl font-bold text-white mb-2">100</div>
            <p className="text-white/90">Total Attendees</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="text-5xl font-bold text-white mb-2">20+</div>
            <p className="text-white/90">Industry Leaders</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="text-5xl font-bold text-white mb-2">1</div>
            <p className="text-white/90">Day of Innovation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
