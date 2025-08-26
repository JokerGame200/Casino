<!DOCTYPE html>
<html lang="{{ str_replace('_','-', app()->getLocale()) }}" class="h-full">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title inertia>{{ config('app.name', 'Next2Win') }}</title>
  <meta name="theme-color" content="#0a0a0a">
  @routes
  @viteReactRefresh
  @vite(['resources/css/app.css','resources/js/app.jsx'])
  @inertiaHead
  <style>
    :root{color-scheme:dark;--bg:#0a0a0a}
    html,body,#app{height:100%} body{margin:0;background:var(--bg);color:#eaeaea;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
    body::before{content:"";position:fixed;inset:-10% -10% auto -10%;height:55%;pointer-events:none;z-index:-1;background:
      radial-gradient(1200px 800px at 15% -12%, rgba(212,175,55,.12), transparent 40%),
      radial-gradient(1000px 600px at 85% -12%, rgba(246,226,122,.06), transparent 45%)}
  </style>
</head>
<body class="antialiased">@inertia
  <noscript><div style="padding:16px;font-family:system-ui;background:#111;color:#f6e27a">JavaScript ist erforderlich.</div></noscript>
</body>
</html>
    <style>
      :root{
        color-scheme: dark;
        --h-header: 72px; --h-provider: 48px; --h-tabs: 48px;
        --bg: #0a0a0a;
      }
      html, body, #app { height: 100%; }
      body{
        margin:0; background: var(--bg); color:#eaeaea;
        -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
      }
      /* Soft gold glow backdrop while SPA bootstraps */
      body::before{
        content:""; position: fixed; inset:-10% -10% auto -10%; height:55%; pointer-events:none; z-index:-1;
        background:
          radial-gradient(1200px 800px at 15% -12%, rgba(212,175,55,.12), transparent 40%),
          radial-gradient(1000px 600px at 85% -12%, rgba(246,226,122,.06), transparent 45%);
      }
      /* Prevent layout shift for sticky bars before React mounts */
      .nx2-header{ position: sticky; top:0; height: var(--h-header); }
      .nx2-providerbar{ position: sticky; top: var(--h-header); height: var(--h-provider); }
      .nx2-tabs{ position: sticky; top: calc(var(--h-header) + var(--h-provider)); height: var(--h-tabs); }
    </style>
</head>
<body class="antialiased">
    @inertia

    <noscript>
      <div style="padding:16px; font-family: system-ui; background:#111; color:#f6e27a;">
        JavaScript ist erforderlich, um Next2Win zu nutzen.
      </div>
    </noscript>
</body>
</html>
