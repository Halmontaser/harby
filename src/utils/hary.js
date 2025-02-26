function groupByField(data, fieldName, collapsedDefault = true) {
    const grouped = {};
  
    // Group data by the specified field
    data.forEach((item) => {
      const key = item[fieldName];
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });
  
    // Convert grouped data into the nested structure
    return Object.entries(grouped).map(([group, rows]) => ({
      group,
      collapsed: collapsedDefault,
      rows,
    }));
  }