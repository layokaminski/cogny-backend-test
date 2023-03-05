const calculateTotalPopulation = (data) => {
  const populations = data.filter(({ doc_record }) => {
    return doc_record['Year'] === '2020' ||
      doc_record['Year'] === '2019' ||
      doc_record['Year'] === '2018';
  }).map(({ doc_record }) => doc_record['Population']);

  const totalPopulation = populations.reduce((acc, population) => acc + population, 0);

  return totalPopulation;
};

module.exports = {
  calculateTotalPopulation,
}
