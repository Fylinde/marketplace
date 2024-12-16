import React from "react";

const EscrowTimeline = ({ transaction }: { transaction: any }) => {
  const { events } = transaction;

  return (
    <div>
      <h4>Escrow Timeline</h4>
      <ul>
        {events.map((event: any, index: number) => (
          <li key={index}>
            <strong>{event.name}</strong>: {event.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EscrowTimeline;
