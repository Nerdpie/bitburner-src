import React, { useState, useEffect } from "react";

interface baubleProps {
  callback: () => boolean;
}

export const ConnectionBauble = (props: baubleProps): React.ReactElement => {
  const [connection, setConnection] = useState(props.callback());

  useEffect(() => {
    const timer = setInterval(() => {
      setConnection(props.callback());
    }, 1000);
    return () => clearInterval(timer);
  });

  return <div className="ConnectionBauble">{connection ? "Connected" : "Disconnected"}</div>;
};