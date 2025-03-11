<script lang="ts">
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DevThemeToolbar from '$lib/components/layout/DevThemeToolbar.svelte';
	
	let { children } = $props();
	let darkMode = $state(false);
	let mediaQuery: MediaQueryList | null = null;
	let isDev = $state(false);
	
	// システムのダークモード設定変更を監視するハンドラー
	function handleSystemThemeChange(e: MediaQueryListEvent) {
		// ローカルストレージに設定がなければ、システム設定に合わせる
		if (localStorage.getItem('darkMode') === null) {
			darkMode = e.matches;
			document.documentElement.classList.toggle('dark', darkMode);
		}
	}

	// マウント時にダークモード設定を取得
	onMount(() => {
		// 開発環境かどうかを確認
		isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
		
		// ローカルストレージから設定を読み込む
		const savedMode = localStorage.getItem('darkMode');
		
		if (savedMode !== null) {
			// ローカルストレージに設定がある場合はそれを使用
			darkMode = savedMode === 'true';
		} else {
			// 設定がない場合はシステム設定を使用
			darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
		
		// メディアクエリのリスナーをセットアップ
		mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', handleSystemThemeChange);
	});
	
	// コンポーネント破棄時にリスナーを削除
	onDestroy(() => {
		if (mediaQuery) {
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
		}
	});

	// ダークモード切り替え関数
	function toggleDarkMode() {
		darkMode = !darkMode;
		document.documentElement.classList.toggle('dark', darkMode);
		// 設定をローカルストレージに保存
		localStorage.setItem('darkMode', darkMode.toString());
	}

	// ライトモードに設定
	function setLightMode() {
		darkMode = false;
		document.documentElement.classList.remove('dark');
		localStorage.setItem('darkMode', 'false');
	}

	// ダークモードに設定
	function setDarkMode() {
		darkMode = true;
		document.documentElement.classList.add('dark');
		localStorage.setItem('darkMode', 'true');
	}
	
	// ローカルストレージのダークモード設定を削除する（システム設定に戻す）
	function resetToSystemTheme() {
		localStorage.removeItem('darkMode');
		darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		document.documentElement.classList.toggle('dark', darkMode);
	}
</script>

<div class="min-h-screen bg-theme-primary text-theme-primary transition-colors duration-200">
	<Header {darkMode} {toggleDarkMode} />

	<!-- メインコンテンツ -->
	<main class="mx-auto max-w-5xl px-6 py-8">
		{@render children()}
	</main>
	
	<!-- 開発環境用のテーマツールバー -->
	{#if isDev}
		<DevThemeToolbar 
			{darkMode} 
			{setLightMode} 
			{setDarkMode} 
			{resetToSystemTheme} 
		/>
	{/if}
</div>
