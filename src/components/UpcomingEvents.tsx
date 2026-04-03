import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { SketchyCTA } from "@/components/sketchy/SketchyCTA";
import { SketchySectionTitle } from "@/components/sketchy/SketchySectionTitle";
import { SketchyTallCard } from "@/components/sketchy/SketchyTallCard";

const UpcomingEvents = ({ variant }: { variant?: 'default' | 'sketchy' }) => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  return (
    <section
      className={`py-16 md:py-20 ${variant === 'sketchy' ? 'paper-bg' : 'bg-background'}`}
      style={variant === 'sketchy' ? { fontFamily: "'Sora', sans-serif" } : undefined}
    >
      <div className="container mx-auto px-4">
        {variant === 'sketchy' ? (
          <SketchySectionTitle>Upcoming Sessions</SketchySectionTitle>
        ) : (
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Upcoming Sessions</h2>
              <p className="text-muted-foreground text-lg">Join a live session to experience the community.</p>
            </div>
            <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer"
              className="text-primary hover:underline font-medium flex items-center gap-2">View Full Calendar →</a>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-8 w-20" />
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-destructive mb-4">Failed to load events</p>
              {variant === "sketchy" ? (
                <SketchyCTA
                  href="https://www.meetup.com/ux-support-group/"
                  variant="dark-bg"
                  fullWidth
                  className="max-w-md mx-auto"
                >
                  View All Events on Meetup.com →
                </SketchyCTA>
              ) : (
                <Button size="lg" asChild>
                  <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">
                    View All Events on Meetup.com →
                  </a>
                </Button>
              )}
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">
              {events.slice(0, 3).map((event, index) => {
                const eventDate = new Date(event.date + 'T00:00:00');
                const borderColors = ['border-t-blue-500', 'border-t-purple-500', 'border-t-green-500'];
                const timeColors = ['text-blue-600', 'text-purple-600', 'text-green-600'];
                return variant === 'sketchy' ? (
                  <SketchyTallCard
                    key={event.id}
                    variant="light"
                    strokeWidth={1.5}
                    paddingClassName="p-5"
                    className="hover:shadow-lg transition-shadow"
                    tapes={[
                      { position: "topLeft", size: "sm" },
                      { position: "bottomRight", size: "sm" },
                    ]}
                  >
                    <div className="flex flex-col h-full">
                      <div className="text-xs font-normal text-uxsg-ink/80 mb-2 tracking-wide font-body">
                        {format(eventDate, 'EEE MMM d')}
                        {event.start_time && <> – {format(new Date(`2000-01-01T${event.start_time}:00`), 'h:mm a')} EST</>}
                      </div>
                      <h3 className="text-2xl font-black leading-tight text-uxsg-ink mb-auto font-headline">{event.title}</h3>
                      <a href={event.meetup_link || 'https://www.meetup.com/ux-support-group/'} target="_blank" rel="noopener noreferrer"
                        className="relative inline-flex items-center justify-center self-start py-2 px-5 mt-6 text-sm rounded-full min-w-[100px] font-body">
                        <span className="relative z-10 text-white font-bold">RSVP +</span>
                        <span className="absolute inset-0 rounded-full bg-uxsg-rsvp border-2 border-uxsg-ink" style={{ boxShadow: "2px 2px 0 #090907" }} aria-hidden />
                      </a>
                    </div>
                  </SketchyTallCard>
                ) : (
                  <Card key={event.id} className={`relative overflow-hidden hover:shadow-lg transition-shadow border-t-4 ${borderColors[index % 3]}`}>
                    <div className="p-6">
                      <div className={`text-sm font-bold uppercase mb-3 ${timeColors[index % 3]}`}>
                        {format(eventDate, 'EEE MMM d')}
                        {event.start_time && <> &middot; {format(new Date(`2000-01-01T${event.start_time}:00`), 'h:mm a')} EST</>}
                      </div>
                      <h3 className="text-xl font-bold mb-3 leading-tight">{event.title}</h3>
                      {event.description && <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{event.description}</p>}
                      <div className="mt-auto">
                        <Button asChild className="w-full">
                          <a href={event.meetup_link || 'https://www.meetup.com/ux-support-group/'} target="_blank" rel="noopener noreferrer">RSVP →</a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl text-muted-foreground mb-8">No upcoming events scheduled at the moment. Check back soon!</p>
              {variant === "sketchy" ? (
                <SketchyCTA
                  href="https://www.meetup.com/ux-support-group/"
                  variant="dark-bg"
                  fullWidth
                  className="max-w-md mx-auto"
                >
                  View All Events on Meetup.com →
                </SketchyCTA>
              ) : (
                <Button size="lg" asChild>
                  <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">
                    View All Events on Meetup.com →
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
