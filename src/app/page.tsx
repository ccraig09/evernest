import Link from "next/link";
import { Heart, Sparkles, Wind, Shield, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sage-50/50 to-transparent dark:from-sage-900/20" />
        <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-sage-100/30 blur-3xl dark:bg-sage-800/20" />
        <div className="absolute bottom-20 left-10 h-48 w-48 rounded-full bg-warm-100/40 blur-3xl dark:bg-warm-800/20" />

        <div className="container relative mx-auto px-4 py-20 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            {/* Logo/Icon */}
            <div className="mb-8 inline-flex items-center justify-center rounded-full bg-sage-100 p-4 dark:bg-sage-900/50">
              <Sparkles className="h-8 w-8 text-sage-600 dark:text-sage-400" />
            </div>

            <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Stories for the
              <span className="block text-sage-600 dark:text-sage-400">
                littlest listener
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Create personalized, calming bedtime stories for your unborn baby.
              A gentle companion for expectant parents to bond through the magic
              of storytelling.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="text-base">
                <Link href="/auth">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/auth?mode=signin">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-sage-50/50 py-20 dark:bg-sage-900/10">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-medium text-foreground">
              Why Start Early?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Reading to your baby before birth creates a foundation of love and
              learning.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Deep Connection</h3>
              <p className="text-slate-600 leading-relaxed">
                Your voice is the first bridge to the world. Reading creates an
                early, unbreakable bond while introducing the melodic rhythms of
                language.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sensory Discovery</h3>
              <p className="text-slate-600 leading-relaxed">
                Early exposure to stories helps babies begin &quot;mapping&quot;
                the world—learning to recognize patterns, colors, and the gentle
                sounds of life.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <Wind className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Peaceful Transition</h3>
              <p className="text-slate-600 leading-relaxed">
                The soothing rhythm of a story lowers stress for both parent and
                baby, creating a sanctuary of calm amidst the journey to birth
                and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-3xl bg-card p-8 shadow-sm ring-1 ring-border sm:p-12">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="font-serif text-3xl font-medium text-foreground">
                  A Note from the Founder
                </h2>
                <div className="mt-6 space-y-4 text-muted-foreground">
                  <p className="text-lg text-slate-600 italic mb-6">
                    &quot;EverNest started with a legacy my father left for me.
                    Before I was even born, he would read stories to me while I
                    was still in my mother’s womb. He wasn’t just building a
                    bond between us; he was introducing me to the world. Through
                    the rhythm of his voice, I began to learn about the
                    brilliance of colors, the shapes of the scenery, and the
                    wonder of animals before I ever opened my eyes. He believed
                    that this early sensory exposure gave me a sense of safety
                    and a head start on understanding the life waiting for me.
                  </p>
                  <p className="text-lg text-slate-600 mb-6">
                    When my wife and I learned we were pregnant, I felt a deep
                    calling to modernize this tradition for a new generation.
                    However, our journey took a difficult turn. During our first
                    trimester, we suffered an unknown miscarriage. For a long
                    time, I couldn't bring myself to work on this. I paused
                    everything.
                  </p>
                  <p className="text-lg text-slate-600 mb-8">
                    As time passed, watching my nieces and nephews grow and
                    seeing my friends start their own families reminded me why
                    this matters. I decided to finish EverNest to honor the hope
                    we had and to serve the families who are on that journey
                    now. It is built to help you share your values and your
                    unique voice, giving your little one a sensory-rich start
                    rooted in love.&quot;
                  </p>
                  <p className="font-medium text-foreground">— Carlos</p>
                </div>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-sage-100 dark:bg-sage-900/50 md:aspect-auto md:h-full">
                {/* Placeholder for a founders image or relevant illustration */}
                <div className="flex h-full items-center justify-center text-sage-300 dark:text-sage-700">
                  <Sparkles className="h-24 w-24 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-medium text-foreground">
              Nurturing connection before birth
            </h2>
            <p className="mt-4 text-muted-foreground">
              Reading aloud has proven benefits for prenatal development and
              parent-baby bonding.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Heart}
              title="Personalized Stories"
              description="Stories featuring your names, your baby's nickname, and themes you choose—making each story uniquely yours."
            />
            <FeatureCard
              icon={BookOpen}
              title="Calming Themes"
              description="From nature and bonding to gentle values and spiritual light—choose what resonates with your family."
            />
            <FeatureCard
              icon={Shield}
              title="Safe & Private"
              description="Your stories are saved securely to your account. No ads, no data selling—just peaceful storytelling."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl font-medium text-foreground">
            Ready to begin your storytelling journey?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Join expectant parents creating magical moments with their little
            ones.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/auth">Create Your First Story</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            EverNest provides creative storytelling for bonding purposes only.
          </p>
          <p className="mt-1">It does not provide medical advice.</p>
          <p className="mt-4">&copy; {new Date().getFullYear()} EverNest</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 inline-flex rounded-xl bg-sage-100 p-3 dark:bg-sage-900/50">
        <Icon className="h-6 w-6 text-sage-600 dark:text-sage-400" />
      </div>
      <h3 className="font-serif text-lg font-medium text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
