const formatDatabase = (array) => {
  const formated = array.map((doc) => {
    return {
      api_name: 'datausa',
      doc_id: doc['ID Nation'],
      doc_name: doc['Nation'],
      doc_record: doc,
    }
  });

  return formated;
};

module.exports = {
  formatDatabase,
}