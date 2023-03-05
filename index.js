const { DATABASE_SCHEMA, DATABASE_URL, SHOW_PG_MONITOR } = require('./config');
const massive = require('massive');
const monitor = require('pg-monitor');
const { fetchData } = require('./utils/fetchData');
const { formatDatabase } = require('./utils/formatDatabase');
const { calculateTotalPopulation } = require('./utils/calculateTotalPopulation');
const { queryCalculateTotalPopulation } = require('./utils/queryCalculateTotalPopulation');

// Call start
(async () => {
    console.log('main.js: before start');

    const db = await massive({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }, {
        // Massive Configuration
        scripts: process.cwd() + '/migration',
        allowedSchemas: [DATABASE_SCHEMA],
        whitelist: [`${DATABASE_SCHEMA}.%`],
        excludeFunctions: true,
    }, {
        // Driver Configuration
        noWarnings: true,
        error: function (err, client) {
            console.log(err);
            //process.emit('uncaughtException', err);
            //throw err;
        }
    });

    if (!monitor.isAttached() && SHOW_PG_MONITOR === 'true') {
        monitor.attach(db.driverConfig);
    }

    const execFileSql = async (schema, type) => {
        return new Promise(async resolve => {
            const objects = db['user'][type];

            if (objects) {
                for (const [key, func] of Object.entries(objects)) {
                    console.log(`executing ${schema} ${type} ${key}...`);
                    await func({
                        schema: DATABASE_SCHEMA,
                    });
                }
            }

            resolve();
        });
    };

    //public
    const migrationUp = async () => {
        return new Promise(async resolve => {
            await execFileSql(DATABASE_SCHEMA, 'schema');

            //cria as estruturas necessarias no db (schema)
            await execFileSql(DATABASE_SCHEMA, 'table');
            await execFileSql(DATABASE_SCHEMA, 'view');

            console.log(`reload schemas ...`)
            await db.reload();

            resolve();
        });
    };

    try {
        await migrationUp();
        await db[DATABASE_SCHEMA].api_data.destroy({});
        const response = await fetchData();
        const formatedDatabase = formatDatabase(response);

        await db[DATABASE_SCHEMA].api_data.insert(formatedDatabase);

        const data = await db[DATABASE_SCHEMA].api_data.find({
            is_active: true
        }).then((data) => {
            return data;
        }).catch(error => {
            console.log(error);
        });;

        const totalPopulationByNode = calculateTotalPopulation(data);
        const totalPopulationByQuery = await queryCalculateTotalPopulation(db);

        console.log(`População total dos anos 2020, 2019 e 2018: ${totalPopulationByNode} pessoas`);
        console.log(`População total dos anos 2020, 2019 e 2018: ${totalPopulationByQuery} pessoas`);
    } catch (e) {
        console.log(e.message)
    } finally {
        console.log('finally');
    }
    console.log('main.js: after start');
})();