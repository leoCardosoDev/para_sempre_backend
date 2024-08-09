export default {
mongodbMemoryServerOptions: {
    binary: {
    skipMD5: true,
    },
    autoStart: true,
    instance: {},
},

useSharedDBForAllJestWorkers: false,
}
