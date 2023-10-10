package datart.core.base.consts;

public enum JobStatus {
    DISABLED(new Byte("1")),

    ENABLED(new Byte("2")),
    DEFAULT(new Byte("0"));

    private final byte status;

    JobStatus(Byte status) {
        this.status = status;
    }

    public Byte getStatus() {
        return status;
    }
}
