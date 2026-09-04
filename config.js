/**
 * @typedef {import('renovate/dist/config/types').AllConfig} AllConfig
 */

const fs = require('fs')

let repoConfig = JSON.parse(fs.readFileSync('renovate.json'))

/** @type {AllConfig} */
let config = {
	onboarding: false,
	requireConfig: 'ignored',

	branchConcurrentLimit: 100,
	prConcurrentLimit: 100,
	prHourlyLimit: 1000,

	// `hostRules` carry credentials, so - as with a real Renovate setup -
	// they live here in the global/self-hosted config rather than in the
	// repo's own `renovate.json`. Values are sourced from the
	// environment rather than committed, so they default to empty in
	// this public repro repo; set `CHAINGUARD_APK_USERNAME`/
	// `CHAINGUARD_APK_PASSWORD` to test against a real private repo.
	hostRules: [
		{
			matchHost: 'apk.cgr.dev',
			username: process.env.CHAINGUARD_APK_USERNAME || '',
			password: process.env.CHAINGUARD_APK_PASSWORD || '',
		},
	],

	...repoConfig,
}

module.exports = config;
