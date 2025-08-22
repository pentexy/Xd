"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check, Users, Shield, Heart, ExternalLink, Zap, Gamepad2, Server, Volume2, VolumeX } from "lucide-react"

export default function CorpsSmpLanding() {
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [musicLoaded, setMusicLoaded] = useState(false)
  const [showCopiedAnimation, setShowCopiedAnimation] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const serverIP = "play.corpssmp.net"

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const toggleMusic = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.volume = 0.3
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Music playback failed:", error)
    }
  }

  const handleAudioLoad = () => {
    setMusicLoaded(true)
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
  }

  const copyServerIP = async () => {
    try {
      await navigator.clipboard.writeText(serverIP)
      setCopied(true)
      setShowCopiedAnimation(true)
      setTimeout(() => {
        setCopied(false)
        setShowCopiedAnimation(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        onLoadedData={handleAudioLoad}
        onEnded={handleAudioEnd}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      >
        <source src="https://files.catbox.moe/su3mg2.mp3" type="audio/mpeg" />
      </audio>

      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleMusic}
          size="sm"
          variant="outline"
          className="neon-border animate-neon-glow bg-background/80 backdrop-blur-sm"
          disabled={!musicLoaded}
        >
          {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
            <h1 className="text-6xl md:text-8xl font-mono font-bold ash-gradient-text animate-ash-glow mb-6 tracking-wider">
              CorpsSmp
            </h1>

            <div className="space-y-4 mb-8 animate-fade-in-up animate-delay-200">
              <p className="text-xl md:text-2xl text-foreground font-light">
                {"Where friendships bloom and adventures never end"}
              </p>
              <p className="text-lg md:text-xl text-muted-foreground font-light">
                {"A place where every block tells a story, every build holds a memory"}
              </p>
              <p className="text-lg md:text-xl text-muted-foreground font-light">
                {"Join our peaceful community and create something beautiful together"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animate-delay-400">
              <div className="relative">
                <Button
                  onClick={copyServerIP}
                  size="lg"
                  className={`text-lg px-8 py-6 transition-all duration-300 hover:scale-105 neon-border animate-neon-glow font-medium ${
                    copied ? "bg-green-600 hover:bg-green-700 text-white" : "bg-primary hover:bg-primary/90"
                  } ${showCopiedAnimation ? "animate-bounce" : ""}`}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-5 w-5 animate-pulse" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-5 w-5" />
                      Copy Server IP: {serverIP}
                    </>
                  )}
                </Button>

                {showCopiedAnimation && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
                      <Check className="h-5 w-5 inline mr-2" />
                      Copied!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-primary mb-12 animate-fade-in-up animate-glow">
            How to Join
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Open Minecraft",
                description: "Launch your Minecraft Java Edition client",
                icon: <Gamepad2 className="h-8 w-8" />,
              },
              {
                step: "2",
                title: "Add Server",
                description: `Click "Multiplayer" then "Add Server" and enter: ${serverIP}`,
                icon: <Server className="h-8 w-8" />,
              },
              {
                step: "3",
                title: "Start Playing!",
                description: "Join our community and begin your adventure",
                icon: <Zap className="h-8 w-8" />,
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="text-center cyber-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up neon-border"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  <div className="text-secondary mx-auto mb-4 flex justify-center animate-glow">{item.icon}</div>
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 neon-border animate-neon-glow">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground font-serif">{item.title}</h3>
                  <p className="text-muted-foreground font-light">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-primary mb-12 animate-fade-in-up animate-glow">
            Server Rules
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Play Peacefully",
                description: "Embrace the spirit of cooperation and kindness in all your interactions",
                color: "text-accent",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Respect Everyone",
                description: "Treat all players with dignity and create a welcoming environment for all",
                color: "text-secondary",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Protect Builds",
                description: "Never break or grief anyone's creations - it may result in a ban",
                color: "text-primary",
              },
            ].map((rule, index) => (
              <Card
                key={index}
                className="text-center cyber-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up neon-border"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  <div className={`${rule.color} mx-auto mb-4 flex justify-center animate-glow`}>{rule.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground font-serif">{rule.title}</h3>
                  <p className="text-muted-foreground font-light">{rule.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Action Buttons Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-12 animate-fade-in-up animate-glow">
            Stay Connected
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 bg-secondary hover:bg-secondary/90 transition-all duration-300 hover:scale-105 neon-border animate-neon-glow font-medium"
            >
              <a href="https://t.me/CorpsSmp" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Updates
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 bg-accent hover:bg-accent/90 transition-all duration-300 hover:scale-105 neon-border animate-neon-glow font-medium animate-delay-200"
            >
              <a href="https://t.me/EternalAura" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Contact
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground font-light text-lg animate-glow">
            This Server Is Made By <Heart className="inline h-5 w-5 text-accent mx-1 animate-glow" /> with Rio.
          </p>
        </div>
      </footer>
    </div>
  )
}
