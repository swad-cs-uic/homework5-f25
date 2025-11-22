import { useState, useCallback, memo } from "react";

interface Contact {
  id: number;
  name: string;
  online: boolean;
}

const generateContacts = (count: number): Contact[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: `Contact ${index + 1}`,
    online: Math.random() > 0.5,
  }));
};

const ContactItem = ({
  contact,
  onToggleStatus,
  onPing,
}: {
  contact: Contact;
  onToggleStatus: (id: number) => void;
  onPing: (id: number) => void;
}) => {
  console.log(`Rendering ContactItem ${contact.id}`);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        borderBottom: "1px solid #eee",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div>
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            marginRight: 8,
            backgroundColor: contact.online ? "#16a34a" : "#9ca3af",
          }}
        />
        <span>{contact.name}</span>
        <span
          style={{
            marginLeft: 8,
            fontSize: 12,
            color: contact.online ? "#16a34a" : "#6b7280",
          }}
        >
          ({contact.online ? "Online" : "Offline"})
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onToggleStatus(contact.id)}>
          Toggle Status
        </button>
        <button onClick={() => onPing(contact.id)}>Ping</button>
      </div>
    </div>
  );
};

const MemoizedContactItem = memo(ContactItem);

//TODO: Implement the useCallback hooks to optimize the event handlers
export default function Challenge3() {
  const [contacts, setContacts] = useState(generateContacts(1000));
  const [pingCount, setPingCount] = useState(0);
  const [filterOnlineOnly, setFilterOnlineOnly] = useState(false);

  const handleOnlineStatus = (id: number) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, online: !contact.online } : contact
      )
    );
  };

  const handlePing = (id: number) => {
    console.log(`Ping sent to contact ${id}`);
    setPingCount((prev) => prev + 1);
  };

  const visibleContacts = filterOnlineOnly
    ? contacts.filter((c) => c.online)
    : contacts;

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Challenge 3: useCallback with a Large Contact List</h1>
      <p>
        This example shows how <code>useCallback</code> helps avoid unnecessary
        re-renders when passing event handlers down to a large list of memoized
        child components.
      </p>

      <div style={{ marginTop: "16px" }}>
        <h3>Instructions:</h3>
        <ol>
          <li>
            Open the browser console and scroll the list to see{" "}
            <code>Rendering ContactItem ...</code> logs.
          </li>
          <li>
            Toggle the &quot;Show online only&quot; filter and observe which
            items re-render.
          </li>
          <li>
            Implement <code>useCallback</code> on{" "}
            <code>handleOnlineStatus</code> and <code>handlePing</code>, then
            compare the console logs in regards to re-rendering optimization.
          </li>
        </ol>
      </div>

      <div
        style={{
          marginTop: "16px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={filterOnlineOnly}
            onChange={(e) => setFilterOnlineOnly(e.target.checked)}
          />{" "}
          Show online only
        </label>
        <span>
          Total pings sent: <strong>{pingCount}</strong>
        </span>
      </div>

      <div
        style={{
          maxHeight: "500px",
          overflow: "auto",
          border: "1px solid #ccc",
        }}
      >
        {visibleContacts.map((contact) => (
          <MemoizedContactItem
            key={contact.id}
            contact={contact}
            onToggleStatus={handleOnlineStatus}
            onPing={handlePing}
          />
        ))}
      </div>
    </div>
  );
}
