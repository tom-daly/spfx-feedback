import * as React from "react";
import styles from "./Feedback.module.scss";
import type { IFeedbackProps } from "./IFeedbackProps";
import { PrimaryButton, TextField } from "@fluentui/react";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

const Feedback: React.FC<IFeedbackProps> = ({
  isDarkTheme,
  sp,
  displayMode,
  title,
  updateProperty,
}) => {
  const [message, setMessage] = React.useState("");
  const [feedbackMsg, setFeedbackMsg] = React.useState("");
  const [feedbackType, setFeedbackType] = React.useState("");
  const [hideFeedback, setHideFeedback] = React.useState(false);

  const clearResult = React.useCallback(() => {
    setMessage("");
    setFeedbackMsg("");
  }, []);

  const showFeedback = (message: string, type: "success" | "error"): void => {
    setFeedbackMsg(message);
    setFeedbackType(type);
    setHideFeedback(false);

    setTimeout(() => {
      setHideFeedback(true); // Begin the fade out transition
      setTimeout(() => {
        setFeedbackMsg("");
        setFeedbackType("");
        setHideFeedback(false); // Reset the hide state for the next message
      }, 500); // This should match the CSS transition time
    }, 8000); // Message stays visible for 8 seconds before fading out
  };

  const onSubmit = async (): Promise<void> => {
    try {
      const currentUser = await sp.web.currentUser.select("Title")();

      const result = await sp.web.lists.getByTitle("Feedback").items.add({
        Title: `New Message from ${currentUser.Title}`,
        Message: message,
      });
      if (result.data) {
        clearResult();
        showFeedback(
          "Your message has been submitted successfully!",
          "success"
        );
      }
    } catch (error) {
      showFeedback(
        "An error occurred while submitting your message. Please try again.",
        "error"
      );
    }
  };

  const onChangeTextFieldChange = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setMessage(newValue || "");
    },
    []
  );

  return (
    <div className={styles.feedback}>
      <WebPartTitle
        displayMode={displayMode}
        title={title}
        updateProperty={updateProperty}
      />
      {feedbackMsg && (
        <div
          className={`${styles.feedbackMessage} ${
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (styles as any)[feedbackType]
          } ${hideFeedback ? styles.hide : ""}`}
        >
          {feedbackMsg}
        </div>
      )}
      <TextField
        className={styles.message}
        label="Message"
        value={message}
        multiline
        onChange={onChangeTextFieldChange}
      />
      <PrimaryButton text="Submit" onClick={onSubmit} />
    </div>
  );
};

export default Feedback;
