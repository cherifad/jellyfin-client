// components/CustomControls.tsx
import React, { Component } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeOff,
  Redo,
  Undo,
  Maximize,
  Minimize,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default class CustomControls extends Component<any, any> {
  player: any;
  constructor(props: any) {
    super(props);

    this.state = {
      isPaused: true,
      volume: 1,
      isFullscreen: false,
    };

    this.player = this.props.vjsBridgeComponent.player();
  }

  componentDidMount() {
    const player = this.player;

    // Attach player event listeners to update the component's state
    player.on("play", () => this.setState({ isPaused: false }));
    player.on("pause", () => this.setState({ isPaused: true }));
    player.on("volumechange", () =>
      this.setState({ volume: player.volume() ?? 1 })
    );
    player.on("fullscreenchange", () =>
      this.setState({ isFullscreen: player.isFullscreen() })
    );
  }

  togglePlayPause = () => {
    if (this.state.isPaused) {
      this.player.play();
    } else {
      this.player.pause();
    }
  };

  toggleFullscreen = () => {
    if (this.state.isFullscreen) {
      this.player.exitFullscreen();
    } else {
      this.player.requestFullscreen();
    }
  };

  changeVolume = (volume: number) => {
    this.player.volume(volume);
  };

  skipTime = (seconds: number) => {
    this.player.currentTime((this.player.currentTime() ?? 0) + seconds);
  };

  render() {
    const { isPaused, volume, isFullscreen } = this.state;

    return (
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center space-x-4">
          {/* Play/Pause Button */}
          {isPaused ? (
            <Play className="cursor-pointer" onClick={this.togglePlayPause} />
          ) : (
            <Pause className="cursor-pointer" onClick={this.togglePlayPause} />
          )}

          {/* Rewind Button */}
          <Undo className="cursor-pointer" onClick={() => this.skipTime(-10)} />

          {/* Fast Forward Button */}
          <Redo className="cursor-pointer" onClick={() => this.skipTime(10)} />

          {/* Volume Slider */}
          <div className="flex items-center space-x-2">
            {volume === 0 ? (
              <VolumeOff
                className="cursor-pointer"
                onClick={() => this.changeVolume(1)}
              />
            ) : (
              <Volume2
                className="cursor-pointer"
                onClick={() => this.changeVolume(0)}
              />
            )}
            <Slider
              defaultValue={[volume * 100]}
              max={100}
              step={1}
              className="w-24"
              onValueChange={(value) => this.changeVolume(value[0] / 100)}
            />
          </div>
        </div>

        {/* Right Controls */}
        <div>
          {/* Fullscreen Toggle */}
          {isFullscreen ? (
            <Minimize
              className="cursor-pointer"
              onClick={this.toggleFullscreen}
            />
          ) : (
            <Maximize
              className="cursor-pointer"
              onClick={this.toggleFullscreen}
            />
          )}
        </div>
      </div>
    );
  }
}
