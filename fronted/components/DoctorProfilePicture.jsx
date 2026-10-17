import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";

const DEFAULT_DOCTOR_IMAGE =
    "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";

const DoctorProfilePicture = ({
    doctor,
    onDoctorUpdated,
    onError,
    onSuccess,
}) => {

    const fileInputRef = useRef(null);

    const [image, setImage] = useState(
        doctor?.profilePicture || DEFAULT_DOCTOR_IMAGE
    );

    const [uploading, setUploading] = useState(false);

    /*
     * Doctor data backend se refresh hone par
     * image bhi update hogi.
     */
    useEffect(() => {

        if (doctor?.profilePicture) {
            setImage(doctor.profilePicture);
        } else {
            setImage(DEFAULT_DOCTOR_IMAGE);
        }

    }, [doctor?.profilePicture]);

    /*
     * Open file picker
     */
    const handleSelectImage = () => {

        if (uploading) return;

        fileInputRef.current?.click();
    };

    /*
     * Image upload
     */
    const handleImageChange = async (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        /*
         * Allowed file types
         */
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {

            const message =
                "Only JPG, JPEG, PNG and WEBP images are allowed.";

            onError?.(message);

            alert(message);

            e.target.value = "";

            return;
        }

        /*
         * 5 MB limit
         */
        if (file.size > 5 * 1024 * 1024) {

            const message =
                "Image size must be less than 5MB.";

            onError?.(message);

            alert(message);

            e.target.value = "";

            return;
        }

        try {

            setUploading(true);

            onError?.("");
            onSuccess?.("");

            /*
             * FormData
             */
            const formData = new FormData();

            formData.append(
                "profilePicture",
                file
            );

            console.log(
                "========== PROFILE IMAGE UPLOAD =========="
            );

            console.log(
                "FILE:",
                file.name
            );

            console.log(
                "SIZE:",
                file.size
            );

            console.log(
                "TYPE:",
                file.type
            );

            /*
             * Backend request
             */
            const response = await api.post(
                "/doctors/upload-profile-picture",
                formData
            );

            console.log(
                "UPLOAD RESPONSE:",
                response.data
            );

            /*
             * Backend response se updated doctor
             */
            const updatedDoctor =
                response.data?.doctor ||
                response.data?.data?.doctor;

            /*
             * Cloudinary URL
             */
            const newImage =
                response.data?.profilePicture ||
                updatedDoctor?.profilePicture;

            if (!newImage) {

                console.error(
                    "Profile picture URL not found:",
                    response.data
                );

                throw new Error(
                    "Profile picture URL was not received from server."
                );
            }

            /*
             * Immediately image change
             */
            setImage(newImage);

            /*
             * Parent Doctor.jsx ko updated doctor do
             */
            if (updatedDoctor) {

                onDoctorUpdated?.(
                    updatedDoctor
                );

            } else {

                /*
                 * Agar backend sirf URL return kare
                 */
                const doctorWithImage = {
                    ...(doctor || {}),
                    profilePicture: newImage,
                };

                onDoctorUpdated?.(
                    doctorWithImage
                );
            }

            onSuccess?.(
                "Profile picture updated successfully."
            );

        } catch (error) {

            console.error(
                "PROFILE PICTURE UPLOAD ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "SERVER RESPONSE:",
                error?.response?.data
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Profile picture upload failed.";

            onError?.(message);

            alert(message);

        } finally {

            setUploading(false);

            /*
             * Same file dobara select karne ke liye
             */
            e.target.value = "";
        }
    };

    return (
        <div className="mb-8 flex flex-col items-center">

            {/* ================= IMAGE CONTAINER ================= */}

            <div className="relative">

                <div
                    className="
                        h-36
                        w-36
                        overflow-hidden
                        rounded-full
                        border-4
                        border-white
                        bg-slate-100
                        shadow-xl
                        ring-4
                        ring-blue-50
                    "
                >

                    <img
                        src={
                            image ||
                            DEFAULT_DOCTOR_IMAGE
                        }
                        alt={
                            doctor?.name ||
                            "Doctor"
                        }
                        className="
                            h-full
                            w-full
                            object-cover
                        "
                        onError={(e) => {

                            e.currentTarget.onerror =
                                null;

                            e.currentTarget.src =
                                DEFAULT_DOCTOR_IMAGE;
                        }}
                    />

                </div>

                {/* ================= CAMERA BUTTON ================= */}

                <button
                    type="button"
                    onClick={handleSelectImage}
                    disabled={uploading}
                    title="Change profile picture"
                    className="
                        absolute
                        bottom-1
                        right-1
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        border-4
                        border-white
                        bg-blue-600
                        text-xl
                        text-white
                        shadow-lg
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >

                    {uploading ? (

                        <span
                            className="
                                h-5
                                w-5
                                animate-spin
                                rounded-full
                                border-2
                                border-white
                                border-t-transparent
                            "
                        />

                    ) : (
                        "📷"
                    )}

                </button>

            </div>

            {/* ================= FILE INPUT ================= */}

            <input
                ref={fileInputRef}
                type="file"
                accept="
                    image/jpeg,
                    image/jpg,
                    image/png,
                    image/webp
                "
                className="hidden"
                onChange={handleImageChange}
            />

            {/* ================= CHANGE BUTTON ================= */}

            <button
                type="button"
                onClick={handleSelectImage}
                disabled={uploading}
                className="
                    mt-4
                    rounded-xl
                    border
                    border-blue-200
                    bg-blue-50
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-blue-700
                    transition
                    hover:bg-blue-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >

                {uploading
                    ? "Uploading..."
                    : "Change Profile Picture"}

            </button>

            {/* ================= INFO ================= */}

            <p className="mt-2 text-xs text-slate-400">
                JPG, PNG or WEBP • Maximum 5MB
            </p>

            {doctor?.name && (
                <p className="mt-2 text-sm font-bold text-slate-700">
                    {doctor.name}
                </p>
            )}

        </div>
    );
};

export default DoctorProfilePicture;