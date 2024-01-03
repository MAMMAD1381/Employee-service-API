const paramParser = async (path, req, res) => {
    const placeholderPattern = /:(\w+)/g;
    const matches = []
    let match;
    let matchesName = [];
    let params = []
    while ((match = placeholderPattern.exec(path)) !== null) {
      matches.push(match[1]);
    }
    // Get positions of each match
    let paramsPos = matches.map(match => {
      const index = path.indexOf(match);
      const slashesBefore = path.slice(0, index).match(/\//g);
      const n = slashesBefore ? slashesBefore.length : 1;
      matchesName[n] = match
      return n
    });
    const extractedValues = paramsPos.map(position => {
      const parts = req.url.split('/');
      return parts[position];
    });
    paramsPos.forEach((match, index) => {
      params[matchesName[match]] = extractedValues[index]
    });
    req.params = params
    return params
}

module.exports = paramParser