import React, { useState } from "react";
import usePodcast from "../hooks/usePodcast";
import useUser from "../hooks/useUser";
import { Button } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";

const SubscribeButton = ({ title, url, image, ...rest }) => {
  const { subscribe, unsubscribe } = usePodcast();
  const { checkUserSubscriptions } = useUser();
  const [clicked, setClicked] = useState(checkUserSubscriptions(url));

  return clicked ? (
    <Button
      variant="primary"
      onClick={async () => {
        await unsubscribe(url);
        setClicked(false);
      }}
      {...rest}
    >
      <div className="d-flex align-items-center justify-content-center">
        <CheckCircleFill size="20" className="mr-2" /> Subscribed
      </div>
    </Button>
  ) : (
    <Button
      variant="outline-primary"
      onClick={async () => {
        await subscribe({ title, feed: url, image });
        setClicked(true);
      }}
      {...rest}
    >
      Subscribe
    </Button>
  );
};

export default SubscribeButton;
