package club.escobar.repository;

public interface LeaderboardRow {
    Long getCreatorId();

    String getCreatorDisplayName();

    Long getTotalViews();

    Long getPublishedContentCount();
}
