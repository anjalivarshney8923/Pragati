import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

export default function FaceVerification({
    onCapture,
    onContinue,
    userId,
    backendBaseUrl,
    aadhaarFile: propAadhaarFile,
    aadhaarPreview: propAadhaarPreview,
}) {
    const CONFIDENCE_THRESHOLD = 0.35;

    const [aadhaar, setAadhaar] = useState(null);
    const [aadhaarPreview, setAadhaarPreview] = useState(null);
    const [selfie, setSelfie] = useState(null);
    const [selfiePreview, setSelfiePreview] = useState(null);
    const [result, setResult] = useState(null);
    const [dob, setDob] = useState("");
    const [dobVerified, setDobVerified] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const webcamRef = useRef(null);

    // convert dataURL to File
    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const extractDobFromFile = async (file) => {
        try {
            setStatus("Extracting DOB from Aadhaar...");
            const fd = new FormData();
            fd.append("image", file);
            const res = await fetch("http://127.0.0.1:5001/extract_dob", { method: "POST", body: fd });
            if (!res.ok) {
                setStatus("DOB extraction failed");
                return null;
            }
            const data = await res.json();
            return data?.dob || null;
        } catch (err) {
            console.error("extractDobFromFile error", err);
            setStatus("DOB extraction failed");
            return null;
        }
    };

    const handleAadhaarChange = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        setAadhaar(file);
        const url = URL.createObjectURL(file);
        setAadhaarPreview(url);
        setDob("");
        setDobVerified(false);
        const extracted = await extractDobFromFile(file);
        if (extracted) {
            setDob(extracted);
            setDobVerified(true);
            setStatus("DOB extracted: " + extracted);
        } else {
            setStatus("DOB not found automatically");
        }
    };

    // if parent provided aadhaar from previous step, prefer it
    useEffect(() => {
        if (propAadhaarFile) {
            setAadhaar(propAadhaarFile);
            if (propAadhaarPreview) setAadhaarPreview(propAadhaarPreview);
            // try extracting dob if not provided
            (async () => {
                try {
                    const extracted = await extractDobFromFile(propAadhaarFile);
                    if (extracted) {
                        setDob(extracted);
                        setDobVerified(true);
                        setStatus("DOB extracted: " + extracted);
                    }
                } catch {
                    // ignore
                }
            })();
        }
    }, [propAadhaarFile, propAadhaarPreview]);


        // verifies given aadhaar/selfie files with the AI service
        const verifyFiles = async (aadhaarFileParam, selfieFileParam) => {
            const fd = new FormData();
            fd.append("aadhaar", aadhaarFileParam);
            fd.append("selfie", selfieFileParam);

            setLoading(true);
            setResult(null);
            setErrorMessage("");
            setStatus("Uploading images to verification service...");

            try {
                const res = await fetch("http://127.0.0.1:5001/verify", { method: "POST", body: fd });
                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt || res.statusText);
                }
                const data = await res.json();
                setResult(data);
                setStatus(`Verification complete. Confidence: ${data.confidence}`);
                return data;
            } catch (err) {
                console.error("verifyFiles error", err);
                setErrorMessage("Verification failed: " + (err?.message || "Unknown"));
                setStatus("Verification failed");
                throw err;
            } finally {
                setLoading(false);
            }
        };

        // Auto-capture is handled inside the effect below to avoid recreating the function each render

        // when component mounts or webcam becomes ready, schedule an automatic capture in 5s
        useEffect(() => {
            let timer = null;
            // only auto-run if webcam ready and we have an Aadhaar (either prop or uploaded)
            if (cameraReady && (propAadhaarFile || aadhaar)) {
                // give user a short moment to see the UI
                timer = setTimeout(() => {
                    (async () => {
                        try {
                            setStatus("Auto-capturing selfie...");
                            const aadhaarToUse = propAadhaarFile || aadhaar;
                            if (!aadhaarToUse) {
                                setStatus("No Aadhaar provided for automatic verification");
                                return;
                            }
                            const imageSrc = webcamRef.current?.getScreenshot();
                            if (!imageSrc) {
                                setErrorMessage("Unable to capture image from webcam");
                                return;
                            }
                            const selfieFile = dataURLtoFile(imageSrc, "selfie_auto.jpg");
                            setSelfie(selfieFile);
                            setSelfiePreview(imageSrc);

                            const verifyData = await verifyFiles(aadhaarToUse, selfieFile);
                            const conf = parseFloat(verifyData?.confidence);
                            if (!Number.isNaN(conf) && conf > CONFIDENCE_THRESHOLD) {
                                setStatus("Auto verification succeeded");
                                setResult(verifyData);
                                if (userId && backendBaseUrl) {
                                    await uploadToBackend();
                                }
                                if (typeof onContinue === "function") {
                                    onContinue(selfieFile, verifyData, { dob, dobVerified });
                                } else if (typeof onCapture === "function") {
                                    onCapture(selfieFile, { dob, dobVerified });
                                }
                            } else {
                                setStatus("Auto verification failed or confidence too low");
                            }
                        } catch (e) {
                            console.warn("auto capture flow failed", e);
                        }
                    })();
                }, 2500);
                setStatus("Auto capture in 2.5 seconds...");
            }
        return () => {
                if (timer) clearTimeout(timer);
            };
        }, [cameraReady, propAadhaarFile, aadhaar]);


    useEffect(() => {
        return () => {
            if (aadhaarPreview) URL.revokeObjectURL(aadhaarPreview);
            if (selfiePreview && selfiePreview.startsWith && selfiePreview.startsWith("blob:")) URL.revokeObjectURL(selfiePreview);
        };
    }, [aadhaarPreview, selfiePreview]);

    const uploadToBackend = async () => {
        if (!userId || !backendBaseUrl) return { ok: false, missing: true };
        const url = `${backendBaseUrl.replace(/\/$/, "")}/api/users/${userId}/documents`;
        const fd = new FormData();
        if (aadhaar) fd.append("aadhaar", aadhaar);
        if (selfie) fd.append("selfie", selfie);
        if (result) {
            fd.append("match", result.match);
            fd.append("confidence", result.confidence);
        }
        if (dob) {
            fd.append("dob", dob);
            fd.append("dobVerified", dobVerified);
        }
        try {
            setStatus("Uploading documents to server...");
            const resp = await fetch(url, { method: "POST", body: fd });
            if (!resp.ok) {
                const txt = await resp.text();
                return { ok: false, message: txt || resp.statusText };
            }
            return { ok: true };
        } catch (err) {
            return { ok: false, message: err.message };
        }
    };

    return (
        <div style={{ maxWidth: 920, padding: 20, margin: "0 auto", background: "#fff", borderRadius: 12, boxShadow: "0 10px 30px rgba(2,6,23,0.06)" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Face Verification</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>Capture a live selfie and verify it against your Aadhaar.</div>
            </div>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 520px", minWidth: 320 }}>
                    <div style={{ marginTop: 14, borderRadius: 10, overflow: "hidden", boxShadow: "0 12px 36px rgba(2,6,23,0.06)" }}>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={640}
                            height={420}
                            videoConstraints={{ facingMode: "user" }}
                            onUserMedia={() => setCameraReady(true)}
                            onUserMediaError={(err) => {
                                console.error(err);
                                setErrorMessage("Unable to access webcam");
                                setCameraReady(false);
                            }}
                        />
                    </div>
                    {aadhaarPreview && (
                        <div style={{ marginTop: 12 }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 13 }}>Aadhaar image</label>
                            <img src={aadhaarPreview} alt="aadhaar" style={{ width: 200, borderRadius: 10, boxShadow: "0 8px 24px rgba(2,6,23,0.04)" }} />
                        </div>
                    )}
                </div>

                <div style={{ width: 360, minWidth: 260 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>Captured Selfie</div>
                        <div style={{ color: "#64748b" }}>{selfie ? "Preview ready" : "No selfie yet"}</div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        {selfiePreview ? (
                            <img src={selfiePreview} alt="selfie" style={{ width: 220, height: 220, objectFit: "cover", borderRadius: 12, boxShadow: "0 10px 28px rgba(2,6,23,0.08)" }} />
                        ) : (
                            <div style={{ width: 220, height: 220, borderRadius: 12, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>No selfie</div>
                        )}

                        {result && (
                            <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "#f8fafc", border: "1px solid #e6eef8" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <div style={{ fontWeight: 800 }}>Verification Result</div>
                                    <div style={{ color: "#475569" }}>{result.match ? "Match" : "No Match"}</div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", color: "#334155", fontSize: 15 }}>
                                    <div>Confidence</div>
                                    <div style={{ fontWeight: 800 }}>{result.confidence}</div>
                                </div>
                                <div style={{ marginTop: 10 }}>
                                    {(() => {
                                        const conf = parseFloat(result.confidence);
                                        if (Number.isNaN(conf)) return <em style={{ color: "#64748b" }}>Confidence unavailable</em>;
                                        return conf > CONFIDENCE_THRESHOLD ? (
                                            <div style={{ color: "#065f46", fontWeight: 800 }}>You can proceed</div>
                                        ) : (
                                            <div style={{ color: "#b91c1c", fontWeight: 800 }}>Cannot proceed — confidence low</div>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}

                        {/* Auto-capture/verify is enabled. Manual buttons removed to simplify the flow. */}
                    </div>

                    <div style={{ marginTop: 12 }}>
                        {dob ? (
                            <div style={{ fontSize: 13 }}>
                                <strong>DOB:</strong> {dob} {dobVerified ? <span style={{ color: "green" }}>(verified)</span> : <span style={{ color: "#666" }}>(not verified)</span>}
                            </div>
                        ) : (
                            <div style={{ fontSize: 13, color: "#666" }}>DOB will be autofilled when Aadhaar is uploaded</div>
                        )}
                        {status && <div style={{ marginTop: 8, color: loading ? "#0366d6" : status.toLowerCase().includes("failed") ? "#c92a2a" : "#166534" }}>{status}</div>}
                        {errorMessage && <div style={{ marginTop: 8, color: "#c92a2a" }}>{errorMessage}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}