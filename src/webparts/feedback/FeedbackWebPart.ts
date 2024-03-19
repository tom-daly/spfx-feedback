import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

import Feedback from "./components/Feedback";
import { IFeedbackProps } from "./components/IFeedbackProps";
import { ISPFXContext, SPFI, spfi, SPFx } from "@pnp/sp";

export interface IFeedbackWebPartProps {
  title: string;
}

export default class FeedbackWebPart extends BaseClientSideWebPart<IFeedbackWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _sp: SPFI;

  public render(): void {
    const element: React.ReactElement<IFeedbackProps> = React.createElement(
      Feedback,
      {
        isDarkTheme: this._isDarkTheme,
        sp: this._sp,
        title: this.properties.title,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        },
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this._sp = spfi().using(SPFx(this.context as unknown as ISPFXContext));
    return super.onInit();
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }
}
