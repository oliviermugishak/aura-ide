import "./App.css";
import RoboticIDE from "./components/robotic-ide";
import { logger } from "@aura/shared";

export default function App() {
  logger.info("Renderer process started");
  return <RoboticIDE />;
}
