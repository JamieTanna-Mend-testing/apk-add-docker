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

	...repoConfig,
}

module.exports = config;
