// components/CustomControlsBridge.tsx
import ReactDOM from "react-dom/client"; // Updated import
import videojs from "video.js";
import CustomControls from "./custom-controls";
import Player from "video.js/dist/types/player";

const VjsComponent = videojs.getComponent("Component");

class CustomControlsBridge extends VjsComponent {
  private root: ReactDOM.Root | null = null; // Store the React root

  constructor(player: Player, options: any) {
    super(player, options);

    this.mountReactComponent = this.mountReactComponent.bind(this);

    // Mount the React component when the player is ready
    player.ready(() => this.mountReactComponent());

    // Clean up the React component when this component is destroyed
    this.on("dispose", () => this.unmountReactComponent());
  }

  mountReactComponent() {
    // Ensure the root is created and render the component
    if (!this.root) {
      this.root = ReactDOM.createRoot(this.el());
    }

    this.root.render(<CustomControls vjsBridgeComponent={this} />);
  }

  unmountReactComponent() {
    // Unmount and cleanup the React root
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}

// Register the Video.js component
videojs.registerComponent("CustomControlsBridge", CustomControlsBridge);

export default CustomControlsBridge;
