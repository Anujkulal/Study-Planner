import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { SplitText } from 'gsap/SplitText';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Brain, 
  CalendarDays, 
  ChevronDown, 
  Clock, 
  LineChart, 
  Sparkles, 
  Target,
  Trophy,
  Zap,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { getAllSessions } from '@/redux/slices/sessionSlice';

gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText);

export const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const {sessions} = useSelector((state: RootState) => state.session);
  const completedCount = sessions?.filter(s => s.status === 'completed').length;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
      dispatch(getAllSessions());
    }, [dispatch])

  // Advanced Hero animations with SplitText
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Master timeline for hero section
      const masterTl = gsap.timeline({ 
        defaults: { ease: 'power4.out' } 
      });

      // Animated particles entrance
      gsap.fromTo('.parallax-element',
        { 
          scale: 0, 
          opacity: 0,
          rotation: () => gsap.utils.random(-360, 360)
        },
        {
          scale: 1,
          opacity: 0.3,
          rotation: 0,
          duration: 2,
          stagger: {
            amount: 1,
            from: 'random'
          },
          ease: 'elastic.out(1, 0.5)'
        }
      );

      // Badge entrance with rotation
      masterTl.fromTo('.hero-badge',
        { 
          opacity: 0, 
          y: -50,
          rotation: -10,
          scale: 0.5
        },
        { 
          opacity: 1, 
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 1,
          ease: 'back.out(2)'
        }
      );

      // Split text animation for title
      const titleElement = document.querySelector('.hero-title-main');
      const gradientElement = document.querySelector('.hero-title-gradient');
      
      if (titleElement && gradientElement) {
        const splitTitle = new SplitText(titleElement, { type: 'chars, words' });
        const splitGradient = new SplitText(gradientElement, { type: 'chars, words' });

        // Animate main title characters
        masterTl.fromTo(splitTitle.chars,
          {
            opacity: 0,
            y: 100,
            rotationX: -90,
            transformOrigin: '0% 50% -50',
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1.2,
            stagger: {
              amount: 0.8,
              from: 'start'
            },
            ease: 'back.out(1.5)'
          },
          '-=0.5'
        );

        // Gradient text with wave effect
        masterTl.fromTo(splitGradient.chars,
          {
            opacity: 0,
            y: 50,
            scaleY: 0,
            transformOrigin: '0% 100%'
          },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 1,
            stagger: {
              amount: 0.6,
              from: 'start',
              ease: 'power2.inOut'
            }
          },
          '-=0.8'
        );

        // Continuous wave animation on gradient text
        gsap.to(splitGradient.chars, {
          y: -15,
          duration: 0.6,
          stagger: {
            each: 0.1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          }
        });
      }

      // Description with typewriter effect
      const descriptionElement = document.querySelector('.hero-description');
      if (descriptionElement) {
        const originalText = descriptionElement.textContent || '';
        descriptionElement.textContent = '';
        
        masterTl.to(descriptionElement, {
          text: {
            value: originalText,
            delimiter: ''
          },
          duration: 2,
          ease: 'none'
        }, '-=0.5');
      }

      // Buttons with elastic bounce
      masterTl.fromTo('.hero-button',
        {
          opacity: 0,
          scale: 0,
          rotation: -180
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'elastic.out(1, 0.5)'
        },
        '-=1'
      );

      // User avatars flying in
      gsap.fromTo('.user-avatar',
        {
          opacity: 0,
          x: () => gsap.utils.random(-200, 200),
          y: () => gsap.utils.random(-200, 200),
          rotation: () => gsap.utils.random(-360, 360)
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: 'back.out(2)',
          delay: 1.5
        }
      );

      // Hero image with 3D flip
      masterTl.fromTo('.hero-image-container',
        {
          opacity: 0,
          rotateY: -90,
          scale: 0.5,
          transformOrigin: 'center center',
          transformPerspective: 1000
        },
        {
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 1.5,
          ease: 'power3.out'
        },
        '-=1'
      );

      // Floating animation for hero image (3D)
      gsap.to('.hero-image-container', {
        y: -30,
        rotateX: 5,
        rotateY: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Floating cards with magnetic effect
      const floatingCards = document.querySelectorAll('.floating-card');
      floatingCards.forEach((card, index) => {
        gsap.fromTo(card,
          {
            opacity: 0,
            scale: 0,
            rotation: index % 2 === 0 ? -180 : 180
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1,
            delay: 2 + index * 0.2,
            ease: 'elastic.out(1, 0.5)'
          }
        );

        // Continuous floating
        gsap.to(card, {
          y: index % 2 === 0 ? -25 : -15,
          x: index % 2 === 0 ? 5 : -5,
          rotation: index % 2 === 0 ? 3 : -3,
          duration: 2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      // Scroll indicator pulse
      gsap.to('.scroll-indicator', {
        y: 10,
        opacity: 0.5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      // Stats counter with morphing effect
      gsap.utils.toArray('.stat-number').forEach((stat: any) => {
        // const target = parseInt(stat.getAttribute('data-target'));
        // const suffix = stat.nextElementSibling?.textContent || '';
        
        ScrollTrigger.create({
          trigger: stat,
          start: 'top 80%',
          onEnter: () => {
            gsap.from(stat, {
              textContent: 0,
              duration: 2.5,
              ease: 'power2.out',
              snap: { textContent: 1 },
              onUpdate: function() {
                const value = Math.ceil(this.targets()[0].textContent);
                stat.textContent = value.toLocaleString();
              }
            });

            // Pulsing animation
            gsap.to(stat.parentElement, {
              scale: 1.1,
              duration: 0.3,
              yoyo: true,
              repeat: 1
            });
          }
        });
      });

      // Feature cards with 3D flip reveal
      gsap.utils.toArray('.feature-card').forEach((card: any, index) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        });

        tl.fromTo(card,
          {
            opacity: 0,
            rotateY: -90,
            z: -200,
            transformPerspective: 1000,
            transformOrigin: 'center center'
          },
          {
            opacity: 1,
            rotateY: 0,
            z: 0,
            duration: 1,
            delay: index * 0.1,
            ease: 'power3.out'
          }
        );

        // Icon rotation on scroll
        tl.fromTo(card.querySelector('.feature-icon'),
          {
            rotation: -360,
            scale: 0
          },
          {
            rotation: 0,
            scale: 1,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)'
          },
          '-=0.8'
        );

        // Hover animation
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            rotateY: 5,
            rotateX: 5,
            duration: 0.3,
            ease: 'power2.out'
          });

          gsap.to(card.querySelector('.feature-icon'), {
            rotation: 360,
            scale: 1.2,
            duration: 0.6,
            ease: 'back.out(2)'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            duration: 0.3,
            ease: 'power2.out'
          });

          gsap.to(card.querySelector('.feature-icon'), {
            rotation: 0,
            scale: 1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)'
          });
        });
      });

      // Testimonial cards with slide and fade
      gsap.utils.toArray('.testimonial-card').forEach((card: any, index) => {
        const direction = index % 2 === 0 ? -100 : 100;
        
        gsap.fromTo(card,
          { 
            opacity: 0, 
            x: direction,
            rotateZ: index % 2 === 0 ? -10 : 10
          },
          {
            opacity: 1,
            x: 0,
            rotateZ: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
            }
          }
        );

        // Stars animation
        const stars = card.querySelectorAll('.star-icon');
        gsap.fromTo(stars,
          {
            scale: 0,
            rotation: -180
          },
          {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
            },
            delay: 0.3
          }
        );
      });

      // CTA section with reveal effect
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.cta-content',
          start: 'top 80%',
        }
      });

      ctaTl.fromTo('.cta-content',
        {
          opacity: 0,
          scale: 0.8,
          rotateX: -15,
          transformPerspective: 1000
        },
        {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 1.2,
          ease: 'power3.out'
        }
      );

      // CTA heading with split text
      const ctaHeading = document.querySelector('.cta-heading');
      if (ctaHeading) {
        const splitCTA = new SplitText(ctaHeading, { type: 'words, chars' });
        
        ctaTl.fromTo(splitCTA.chars,
          {
            opacity: 0,
            y: 50,
            rotationX: -90
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            stagger: 0.03,
            ease: 'back.out(1.5)'
          },
          '-=0.8'
        );
      }

      // CTA buttons with magnetic effect
      const ctaButtons = document.querySelectorAll('.cta-button');
      ctaButtons.forEach((button, index) => {
        ctaTl.fromTo(button,
          {
            opacity: 0,
            y: 50,
            scale: 0
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'elastic.out(1, 0.5)'
          },
          '-=0.5'
        );

        // Hover effect
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.5)'
          });
        });
      });

      // Background gradient animation
      gsap.to('.bg-gradient-1', {
        x: '20%',
        y: '20%',
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.bg-gradient-2', {
        x: '-20%',
        y: '-20%',
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Advanced mouse parallax with 3D depth
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const deltaX = (clientX - centerX) / centerX;
      const deltaY = (clientY - centerY) / centerY;

      // Parallax for different layers
      gsap.to('.parallax-layer-1', {
        x: deltaX * 50,
        y: deltaY * 50,
        duration: 0.5,
        ease: 'power2.out'
      });

      gsap.to('.parallax-layer-2', {
        x: deltaX * 30,
        y: deltaY * 30,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.to('.parallax-layer-3', {
        x: deltaX * 15,
        y: deltaY * 15,
        duration: 0.7,
        ease: 'power2.out'
      });

      // 3D rotation for hero image
      gsap.to('.hero-image-container', {
        rotateY: deltaX * 10,
        rotateX: -deltaY * 10,
        duration: 0.5,
        ease: 'power2.out'
      });

      // Particles follow mouse with delay
      gsap.to('.parallax-element', {
        x: deltaX * 20,
        y: deltaY * 20,
        duration: 1,
        stagger: {
          amount: 0.5,
          from: 'random'
        },
        ease: 'power1.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <CalendarDays className="h-8 w-8" />,
      title: 'Smart Scheduling',
      description: 'AI-powered schedule optimization based on your study patterns',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI Insights',
      description: 'Get personalized recommendations to improve your learning',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <LineChart className="h-8 w-8" />,
      title: 'Progress Tracking',
      description: 'Visualize your study progress with beautiful analytics',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Goal Management',
      description: 'Set and achieve your study goals with smart reminders',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Time Optimization',
      description: 'Make the most of your study time with intelligent planning',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'Study Assistant',
      description: 'Chat with AI to get instant study tips and motivation',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  const stats = [
    { number: 50000, suffix: '+', label: 'Active Students' },
    { number: 1000000, suffix: '+', label: 'Study Hours Tracked' },
    { number: 95, suffix: '%', label: 'Success Rate' },
    { number: 4.9, suffix: '/5', label: 'User Rating' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Medical Student',
      avatar: '👩‍⚕️',
      content: 'This planner completely transformed how I organize my study sessions. The AI insights are incredibly helpful!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Engineering Student',
      avatar: '👨‍💻',
      content: 'The best study tool I\'ve used. The progress tracking keeps me motivated and on track.',
      rating: 5,
    },
    {
      name: 'Emma Davis',
      role: 'Law Student',
      avatar: '👩‍⚖️',
      content: 'Smart scheduling saves me hours every week. I can\'t imagine studying without it now.',
      rating: 5,
    },
  ];

  return (
    <div ref={heroRef} className="min-h-screen bg-background overflow-hidden cursor-none">
      <CustomCursor />
      
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-gradient-1 absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
        <div className="bg-gradient-2 absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-green-500/10 via-cyan-500/10 to-blue-500/10 blur-3xl" />
      </div>

      {/* Floating particles with layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`parallax-element parallax-layer-${(i % 3) + 1} absolute w-2 h-2 bg-primary/20 rounded-full`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 ">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-xl" />
            <span className="text-xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Study Planner
            </span>
          </div>
          <div className="flex items-center gap-4">
       
            <Button onClick={() => navigate('/app')} className="gap-2">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 parallax-layer-2">
            <Badge className="hero-badge opacity-0 gap-2 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4" />
              AI-Powered Study Management
            </Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="hero-title-main block">Study Smarter,</span>
              <span className="hero-title-gradient block bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                Not Harder
              </span>
            </h1>

            {/* <p className="hero-description text-xl text-muted-foreground max-w-xl">
              Transform your study routine with AI-powered insights, smart scheduling, 
              and personalized recommendations. Achieve your academic goals faster.
            </p> */}

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/app')}
                className="hero-button opacity-0 gap-2 text-lg px-8 py-6 shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all"
              >
                Start Free Trial
                <Zap className="h-5 w-5" />
              </Button>
              
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍💼'].map((emoji, i) => (
                    <div 
                      key={i}
                      className="user-avatar w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-lg ring-2 ring-background"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold">50,000+ Students</div>
                  <div className="text-muted-foreground">already studying smarter</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="hero-image-container opacity-0 relative perspective-1000 parallax-layer-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 " />
              <img 
                src="/hero.png" 
                alt="Study Planner Dashboard"
                className="w-full h-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="w-full aspect-4/3 bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 flex items-center justify-center">
                      <div class="text-white text-center">
                        <div class="text-6xl mb-4">📚</div>
                        <div class="text-2xl font-bold">Your Study Dashboard</div>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>

            {/* Floating cards */}
            <div className="floating-card absolute -top-8 -right-8 bg-background/80 backdrop-blur-lg p-4 rounded-xl shadow-xl border border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Study Streak</div>
                  <div className="text-xl font-bold">7 Days 🔥</div>
                </div>
              </div>
            </div>

            <div className="floating-card absolute -bottom-8 -left-8 bg-background/80 backdrop-blur-lg p-4 rounded-xl shadow-xl border border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Goals Completed</div>
                  <div className="text-xl font-bold">{completedCount} / {sessions?.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator flex justify-center mt-20">
          <ChevronDown className="h-8 w-8 text-muted-foreground" />
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  <span className="stat-number" data-target={stat.number}>0</span>
                  <span className="stat-suffix">{stat.suffix}</span>
                </div>
                <div className="text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 parallax-layer-2">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Excel in Your Studies
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you study more efficiently and achieve better results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="feature-card opacity-0 group border-2 hover:border-primary/50"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <CardContent className="p-6">
                  <div className={`feature-icon w-16 h-16 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-4 text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 parallax-layer-2">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Students Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="testimonial-card opacity-0 hero-image-container parallax-layer-1">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="star-icon h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-32">
        <div className="container mx-auto px-4">
          <div className="cta-content opacity-0 max-w-4xl mx-auto text-center bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-20 relative overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative z-10">
              <h2 className="cta-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Studies?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already studying smarter with AI-powered insights
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate('/app')}
                  className="cta-button gap-2 text-lg px-8 py-6"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
                
              </div>
              <div className="flex items-center justify-center gap-8 mt-8 text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Free 14-day trial
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  No credit card required
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-lg" />
                <span className="font-bold">Study Planner</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered study management for students who want to excel.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-12 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Study Planner. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .bg-grid-white\/10 {
          background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};