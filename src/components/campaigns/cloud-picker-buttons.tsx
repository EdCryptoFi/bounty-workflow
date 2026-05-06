"use client";

import Script from "next/script";
import { useState } from "react";

declare global {
  interface Window {
    Dropbox: {
      choose: (options: {
        success: (files: { link: string; name: string }[]) => void;
        cancel?: () => void;
        linkType: "preview" | "direct";
        multiselect: boolean;
        extensions?: string[];
      }) => void;
    };
    gapi: {
      load: (api: string, callback: () => void) => void;
    };
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
      picker: {
        PickerBuilder: new () => PickerBuilderInstance;
        ViewId: { DOCS: string };
        Action: { PICKED: string };
      };
    };
  }

  interface PickerBuilderInstance {
    addView(viewId: string): PickerBuilderInstance;
    setOAuthToken(token: string): PickerBuilderInstance;
    setDeveloperKey(key: string): PickerBuilderInstance;
    setCallback(
      callback: (data: { action: string; docs: { url: string; name: string }[] }) => void,
    ): PickerBuilderInstance;
    build(): { setVisible: (v: boolean) => void };
  }
}

const DROPBOX_APP_KEY = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY ?? "";
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function CloudPickerButtons({
  onFile,
}: {
  onFile: (url: string, name: string, source: "dropbox" | "drive") => void;
}) {
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);

  function onGapiLoad() {
    window.gapi.load("picker", () => setPickerApiLoaded(true));
  }

  function openDropbox() {
    if (!window.Dropbox) return;
    window.Dropbox.choose({
      success: (files) => {
        if (files[0]) onFile(files[0].link, files[0].name, "dropbox");
      },
      linkType: "direct",
      multiselect: false,
      extensions: [".pdf", ".png", ".jpg", ".webp", ".gif", ".docx", ".txt"],
    });
  }

  function openDrive() {
    if (!pickerApiLoaded || !window.google?.accounts?.oauth2) return;

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/drive.readonly",
      callback: (tokenResponse) => {
        const picker = new window.google.picker.PickerBuilder()
          .addView(window.google.picker.ViewId.DOCS)
          .setOAuthToken(tokenResponse.access_token)
          .setDeveloperKey(GOOGLE_API_KEY)
          .setCallback((data) => {
            if (
              data.action === window.google.picker.Action.PICKED &&
              data.docs[0]
            ) {
              onFile(data.docs[0].url, data.docs[0].name, "drive");
            }
          })
          .build();
        picker.setVisible(true);
      },
    });
    tokenClient.requestAccessToken();
  }

  return (
    <>
      <Script
        src="https://www.dropbox.com/static/api/2/dropins.js"
        id="dropboxjs"
        data-app-key={DROPBOX_APP_KEY}
        strategy="lazyOnload"
      />
      <Script
        src="https://apis.google.com/js/api.js"
        id="google-api"
        strategy="lazyOnload"
        onLoad={onGapiLoad}
      />
      <Script
        src="https://accounts.google.com/gsi/client"
        id="google-gsi"
        strategy="lazyOnload"
      />

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
          Importar de
        </span>

        <button
          type="button"
          onClick={openDrive}
          title="Google Drive"
          disabled={!pickerApiLoaded}
          className="flex items-center gap-1.5 rounded border border-outline-variant/40 bg-surface-container/50 px-2.5 py-1.5 text-[11px] font-semibold text-on-surface hover:border-[#4285F4]/40 hover:bg-[rgba(66,133,244,0.06)] transition-all disabled:opacity-40"
        >
          <IconGoogleDrive />
          Drive
        </button>

        <button
          type="button"
          onClick={openDropbox}
          title="Dropbox"
          className="flex items-center gap-1.5 rounded border border-outline-variant/40 bg-surface-container/50 px-2.5 py-1.5 text-[11px] font-semibold text-on-surface hover:border-[#0061FF]/40 hover:bg-[rgba(0,97,255,0.06)] transition-all"
        >
          <IconDropbox />
          Dropbox
        </button>
      </div>
    </>
  );
}

function IconGoogleDrive() {
  return (
    <svg viewBox="0 0 87.3 78" className="h-3.5 w-3.5 shrink-0" aria-hidden>
      <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L27.5 53H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
      <path d="M43.65 25L29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.5A9 9 0 000 53h27.5z" fill="#00ac47" />
      <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 57.5c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.5z" fill="#ea4335" />
      <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
      <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
      <path d="M73.4 26.5l-12.65-21.9c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28H87.1c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
    </svg>
  );
}

function IconDropbox() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" aria-hidden fill="#0061FF">
      <path d="M6 2L0 5.82l6 3.82 6-3.82zm12 0l-6 3.82 6 3.82 6-3.82zM0 13.46l6 3.82 6-3.82-6-3.82zm18-3.82l-6 3.82 6 3.82 6-3.82zM6 18.18l6 3.82 6-3.82-6-3.82z" />
    </svg>
  );
}
