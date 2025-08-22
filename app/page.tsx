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
  const [audioError, setAudioError] = useState<string | null>(null)
  const [showCopiedAnimation, setShowCopiedAnimation] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const serverIP = "play.corpssmp.lol"

  useEffect(() => {
    setIsVisible(true)
    testAudioUrl()
  }, [])

  const testAudioUrl = async () => {
    try {
      const response = await fetch("https://files.catbox.moe/su3mg2.mp3", {
        method: "HEAD",
        mode: "no-cors", // Handle CORS issues
      })
      console.log("[v0] Audio URL test completed")
    } catch (error) {
      console.log("[v0] Audio URL test failed:", error)
      setAudioError("Audio file may not be accessible due to network restrictions")
    }
  }

  const toggleMusic = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        const audio = audioRef.current

        if (audio.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) {
          console.log("[v0] Audio not ready, waiting...")
          setAudioError("Audio is still loading, please wait...")
          return
        }

        if (!musicLoaded && audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
          setAudioError("Audio file could not be loaded - external source may be blocked")
          return
        }

        audio.volume = 0.3

        const playPromise = audio.play()
        if (playPromise !== undefined) {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Play timeout")), 5000)
          })

          await Promise.race([playPromise, timeoutPromise])
          setIsPlaying(true)
          setAudioError(null)
        }
      }
    } catch (error) {
      console.error("[v0] Music playback failed:", error)
      setIsPlaying(false)

      if (error instanceof Error) {
        if (error.message.includes("interrupted")) {
          setAudioError("Audio playback interrupted - please try again")
        } else if (error.message.includes("timeout")) {
          setAudioError("Audio loading timed out - file may be unavailable")
        } else {
          setAudioError(`Playback failed: ${error.message}`)
        }
      } else {
        setAudioError("Audio playback failed - external file may be blocked")
      }
    }
  }

  const handleAudioLoad = () => {
    console.log("[v0] Audio loaded successfully")
    setMusicLoaded(true)
    setAudioError(null)
  }

  const handleAudioError = (e: Event) => {
    console.log("[v0] Audio error event:", e)
    const audio = audioRef.current
    if (audio && audio.error) {
      const errorCode = audio.error.code
      const errorMessage = audio.error.message || "Unknown error"
      console.log("[v0] Audio error details - Code:", errorCode, "Message:", errorMessage)

      let userFriendlyError = "Failed to load background music"
      switch (errorCode) {
        case MediaError.MEDIA_ERR_ABORTED:
          userFriendlyError = "Audio loading was cancelled"
          break
        case MediaError.MEDIA_ERR_NETWORK:
          userFriendlyError = "Network error - external audio file blocked"
          break
        case MediaError.MEDIA_ERR_DECODE:
          userFriendlyError = "Audio file is corrupted or unsupported"
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          userFriendlyError = "Audio source blocked by browser security"
          break
        default:
          userFriendlyError = `Audio error (Code: ${errorCode})`
      }
      setAudioError(userFriendlyError)
    } else {
      console.log("[v0] Audio error but no error object available")
      setAudioError("External audio file is blocked or unavailable")
    }
    setMusicLoaded(false)
    setIsPlaying(false)
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
  }

  const handleAudioProgress = () => {
    const audio = audioRef.current
    if (audio && audio.buffered.length > 0) {
      const buffered = audio.buffered.end(0)
      const duration = audio.duration
      if (duration > 0) {
        console.log("[v0] Audio loading progress:", Math.round((buffered / duration) * 100), "%")
      }
    }
  }

  const copyServerIP = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(serverIP)
      } else {
        // Fallback for non-HTTPS environments
        const textArea = document.createElement("textarea")
        textArea.value = serverIP
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand("copy")
        textArea.remove()
      }
      setCopied(true)
      setShowCopiedAnimation(true)
      setTimeout(() => {
        setCopied(false)
        setShowCopiedAnimation(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      alert(`Please copy manually: ${serverIP}`)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        preload="metadata"
        onLoadedData={handleAudioLoad}
        onError={handleAudioError}
        onProgress={handleAudioProgress}
        onEnded={handleAudioEnd}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onCanPlay={() => {
          console.log("[v0] Audio can start playing")
          setMusicLoaded(true)
        }}
        onLoadStart={() => console.log("[v0] Audio loading started")}
        onStalled={() => console.log("[v0] Audio loading stalled")}
        onSuspend={() => console.log("[v0] Audio loading suspended")}
        onWaiting={() => console.log("[v0] Audio waiting for data")}
        crossOrigin="anonymous"
      >
        <source src="https://files.catbox.moe/su3mg2.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleMusic}
          size="sm"
          variant="outline"
          className="clean-border bg-background/80 backdrop-blur-sm"
          title={audioError || (musicLoaded ? "Toggle music" : "Loading music...")}
        >
          {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        {audioError && (
          <div className="absolute top-full mt-2 right-0 bg-red-500/90 text-white text-xs p-2 rounded max-w-48 z-10">
            {audioError}
          </div>
        )}
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
                  className={`text-lg px-8 py-6 transition-all duration-300 hover:scale-105 clean-border font-medium ${
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
                className="text-center clean-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  <div className="text-secondary mx-auto mb-4 flex justify-center animate-glow">{item.icon}</div>
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 clean-border">
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
                className="text-center clean-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
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
              className="text-lg px-8 py-6 bg-secondary hover:bg-secondary/90 transition-all duration-300 hover:scale-105 clean-border font-medium"
            >
              <a href="https://t.me/CorpsSmp" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Updates
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 bg-accent hover:bg-accent/90 transition-all duration-300 hover:scale-105 clean-border font-medium animate-delay-200"
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
