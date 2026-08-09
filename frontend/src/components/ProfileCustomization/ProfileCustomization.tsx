import { useState } from 'react';

interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  avatar?: string;
  banner?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
}

interface ProfileCustomizationProps {
  initialData: ProfileData;
  onSave: (data: ProfileData) => void;
  onCancel: () => void;
}

export function ProfileCustomization({
  initialData,
  onSave,
  onCancel,
}: ProfileCustomizationProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData.avatar || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialData.banner || null);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
        handleChange('avatar', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string);
        handleChange('banner', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="profile-customization">
      <h2>Customize Profile</h2>
      
      <div className="banner-section">
        <div className="banner-preview" style={{ backgroundImage: `url(${bannerPreview})` }}>
          <label className="banner-upload">
            <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
            <span>Change Banner</span>
          </label>
        </div>
      </div>

      <div className="avatar-section">
        <div className="avatar-preview" style={{ backgroundImage: `url(${avatarPreview})` }}>
          <label className="avatar-upload">
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            <span>Change Avatar</span>
          </label>
        </div>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label htmlFor="username">Username *</label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            value={formData.displayName}
            onChange={(e) => handleChange('displayName', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            maxLength={500}
            rows={4}
            className="form-textarea"
            placeholder="Tell us about yourself..."
          />
          <span className="char-count">{formData.bio.length}/500</span>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={formData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="form-input"
            placeholder="City, Country"
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="url"
            value={formData.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="form-input"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="twitter">Twitter</label>
          <input
            id="twitter"
            type="text"
            value={formData.twitter || ''}
            onChange={(e) => handleChange('twitter', e.target.value)}
            className="form-input"
            placeholder="@username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="github">GitHub</label>
          <input
            id="github"
            type="text"
            value={formData.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            className="form-input"
            placeholder="username"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
