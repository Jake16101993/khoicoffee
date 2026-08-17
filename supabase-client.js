(function(){
  const cfg = window.KHOI_SUPABASE_CONFIG || {};
  const ready = Boolean(cfg.url && cfg.publishableKey && window.supabase?.createClient);
  window.KhoiDB = {
    ready,
    client: ready ? window.supabase.createClient(cfg.url, cfg.publishableKey) : null
  };
})();
