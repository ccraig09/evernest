import Link from 'next/link';
import { Sparkles, Heart, BookOpen, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <Link href="/auth">
              Create Your First Story
            </Link>
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
      <h3 className="font-serif text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

