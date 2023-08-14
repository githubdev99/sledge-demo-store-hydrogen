export interface ISledgeGlobalScriptProps {
  apiKey: string;
  instantSearchApiKey: string;
  userId?: any;
  userFullName?: string;
}

export function SledgeGlobalScript({
  apiKey,
  instantSearchApiKey,
  userId = '',
  userFullName = '',
}: ISledgeGlobalScriptProps) {
  return (
    <>
      <script
        type="module"
        data-sledge-api-key={apiKey}
        data-sledge-instant-search-api-key={instantSearchApiKey}
        //TODO : Commented cause Error
        // data-user-id={userId}
        // data-user-fullname={userFullName}
        id="sledge-embed-script"
        src="https://cdn.jsdelivr.net/npm/@offstack/sledge-js@0.0.77/dist/sledge.umd.min.js"
      ></script>
    </>
  );
}
