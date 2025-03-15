import React, { useState, useEffect, useRef } from "react";
import { NameEditorProps } from "./types";
import "./NameEditor.css";

const NameEditor: React.FC<NameEditorProps> = ({ initialName, onSave, onCancel }) => {
  const [name, setName] = useState<string>(initialName);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus on input when component mounts
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  return (
    <div className="name-edit-container">
      <input ref={nameInputRef} type="text" value={name} onChange={(e) => setName(e.target.value)} className="name-edit-input" placeholder="Enter new name" maxLength={15} />
      <button onClick={() => onSave(name)} className="name-save-btn">
        Save
      </button>
      <button onClick={onCancel} className="name-cancel-btn">
        Cancel
      </button>
    </div>
  );
};

export default NameEditor;
