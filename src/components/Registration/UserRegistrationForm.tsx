import React, { useState } from 'react';
import './UserRegistrationForm.css';

interface UserRegistrationFormProps {
  onNext: (formData: FormData) => void;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData); // Assuming this proceeds to the next screen or submits data
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create a Personal Account</h1>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Create Account</button>
    </form>
  );
};

export default UserRegistrationForm;
