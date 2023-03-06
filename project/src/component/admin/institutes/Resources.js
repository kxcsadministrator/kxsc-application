function Resources({ resources }) {
  return (
    <div>
      {resources?.length ? (
        <table className="bg-white rounded-md shadow-md">
          <thead>
            <tr>
              <th scope="col">s/n</th>
              <th scope="col">Resources</th>
            </tr>
          </thead>
          <tbody>
            {resources?.map((resource, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{resource.topic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <p>No Resources</p>
        </div>
      )}
    </div>
  );
}

export default Resources;
