import { DisplayMode } from "@microsoft/sp-core-library";
import { SPFI } from "@pnp/sp";

export interface IFeedbackProps {
  isDarkTheme: boolean;
  sp: SPFI;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
}
