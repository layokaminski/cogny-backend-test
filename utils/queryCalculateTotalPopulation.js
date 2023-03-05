const queryCalculateTotalPopulation = async (database) => {
  const result = await database.query(
                `SELECT SUM(CAST(doc_record->>\'Population\' AS INTEGER)) 
                AS total_population 
                FROM layokaminski.api_data 
                WHERE doc_record->>\'Year\' IN (\'2020\', \'2019\', \'2018\')`
  );

  return parseInt(result[0].total_population);
};

module.exports = {
  queryCalculateTotalPopulation,
}