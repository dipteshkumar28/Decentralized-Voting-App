import React from 'react';

const Connected = (props) => {
  return (
    <div className='connected-container'>
      <h1 className="connected-header">You are Connected to Metamask</h1>
      <p className="connected-account">Metamask Account: {props.account}</p>
      <p className="connected-account">Remaining Time: {props.remainingtime ? `${props.remainingtime} seconds` : "N/A"}</p>

      {props.showButton ? (
        <p className="connected-account">You have already voted</p>
      ) : (
        <div>
          <input
            type="number"
            placeholder="Enter Candidate Index"
            value={props.number || ""}
            onChange={props.handleNumberChange}
          />
          <br />
          <button className="vote-button" onClick={props.voteFunction}>Vote</button>
        </div>
      )}

      <table id="myTable" className="candidates-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Candidate Name</th>
            <th>Candidate Votes</th>
          </tr>
        </thead>
        <tbody>
          {props.candidates && props.candidates.length > 0 ? (
            props.candidates.map((candidate, index) => (
              <tr key={index}>
                <td>{candidate.index}</td>
                <td>{candidate.name}</td>
                <td>{candidate.voteCount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No candidates available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Connected;
