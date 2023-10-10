/**
* Data Cube
*
* Copyright  2023
*
* 河南国立软件技术有限公司
*
*/

const { createJestConfig } = require('@craco/craco');

const cracoConfig = require('./craco.config.js');
const jestConfig = createJestConfig(cracoConfig, {});

module.exports = jestConfig;
