<script lang="ts">
  import { onMount } from 'svelte';
  import { signupStore } from './signup-store';
  import { get } from 'svelte/store';

  export let handleSubmit: () => void;
  let phone = '';
  let error = '';
  let hcaptchaWidget: any = null;

  onMount(() => {
    // Load hCaptcha script
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Initialize hCaptcha
    (window as any).hcaptchaReady = () => {
      hcaptchaWidget = (window as any).hcaptcha.render('hcaptcha', {
        sitekey: import.meta.env.VITE_HCAPTCHA_SITEKEY,
        callback: (token: string) => {
          signupStore.update(state => ({
            ...state,
            captchaToken: token
          }));
        }
      });
    };
  });

  function validate() {
    error = '';
    const currentState = get(signupStore);
    if (!phone.match(/^\+\d{10,15}$/)) {
      error = 'Please enter a valid international phone number starting with +';
      return false;
    }
    if (!currentState.captchaToken) {
      error = 'Please complete the CAPTCHA verification';
      return false;
    }
    return true;
  }

  function handleFinalSubmit() {
    if (!validate()) return;
    signupStore.update(state => ({
      ...state,
      phoneNumber: phone
    }));
    handleSubmit();
  }
</script>

<div class="space-y-6">
  <div class="space-y-4">
    <div class="form-control">
      <label class="label">
        <span class="label-text text-[#1E1E1E] font-medium">Phone Number</span>
      </label>
      <input
        type="tel"
        class="input input-bordered w-full"
        placeholder="+12345678900"
        bind:value={phone}
      />
    </div>

    <div id="hcaptcha" class="h-captcha" data-sitekey="YOUR_HCAPTCHA_SITE_KEY"></div>
  </div>

  {#if error}
    <div class="text-red-600 text-sm">{error}</div>
  {/if}

  <div class="flex w-full justify-end">
    <button
      on:click={handleFinalSubmit}
      class="btn bg-primary text-white hover:bg-primary-dark w-fit px-8"
    >
      Sign Up
    </button>
  </div>
</div>
