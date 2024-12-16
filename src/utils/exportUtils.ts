export const exportToCSV = (data: any[], fileName: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      data.map((row) => Object.values(row).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };
  