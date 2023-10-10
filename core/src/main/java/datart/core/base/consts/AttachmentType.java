package datart.core.base.consts;

public enum AttachmentType {

    EXCEL(".xlsx"),
    IMAGE(".png"),
    SHARE_URL("share_url"),
    PDF(".pdf");

    private String suffix;

    AttachmentType(String suffix) {
        this.suffix = suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public String getSuffix() {
        return suffix;
    }
}
