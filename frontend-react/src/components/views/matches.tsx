import MatchMenu from "./match-menu";
import MatchDetails from "./match-details";
import { useEffect, useState } from "react";

const MatchNotifications = () => {
  const [currentId, setCurrentId] = useState<string | undefined>();

  // Extract this logic to a separate function
  const parseHash = () => {
    const hash = window.location.hash.substring(1);
    const [path] = hash.split('?');
    const segments = path.split('/');
    
    return segments.length > 1 ? segments[1] : undefined;
  };

  useEffect(() => {
    // Set initial ID
    setCurrentId(parseHash());

    // Add event listener for hash changes
    const handleHashChange = () => {
      setCurrentId(parseHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); // Empty dependency array means this runs only on mount/unmount

  const render = () => {
    switch (currentId) {
      case undefined: 
        return <MatchMenu />;
      default:
        return <MatchDetails matchID={currentId} />;
    }
  };

  return <>{render()}</>;
};

export default MatchNotifications;