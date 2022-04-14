import { authService } from '../auth';
import { downloadExercises } from '../download-exercises/';
import { loadVideoDownloadOptions } from '../load-video-download-options';
import { loadVideosList } from '../load-videos-list';
import { promptCourseUrl } from '../prompt-course-url';
import { promptDownloadFolder } from '../prompt-download-folder';
import { selectVideoSize } from '../select-video-size';
import { messageService, Video, parseAxiosResponseToDoc, apiService } from '../shared';
import { downloadSubtitles } from './download-subtitles/download-subtitles.function';
import { downloadVideos } from './download-videos.function';

export async function downloadCourse(appRoot: string): Promise<void> {
  const authHeaders = await authService.getAuthHeaders();
  const courseUrl = await promptCourseUrl();
  const coursePage = await apiService.get(courseUrl, undefined, authHeaders).then(parseAxiosResponseToDoc);
  const videosList = await loadVideosList(courseUrl, coursePage);

  messageService.out({
    text: formatVideosListForDisplay(videosList.videos),
    type: 'success',
  });

  const downloadableVideos = await loadVideoDownloadOptions(videosList);
  const selectedSize = await selectVideoSize(downloadableVideos);

  messageService.out({
    text: `Selected video width: ${selectedSize}`,
    type: 'success',
  });

  const downloadFolderPath = await promptDownloadFolder(appRoot);

  messageService.out({
    text: `Download path: ${downloadFolderPath}\n`,
    type: 'info',
  });

  await downloadVideos(downloadableVideos, selectedSize, downloadFolderPath);
  /** TODO: figure out how to get necessary info with a single request instead
   *  of the current two requests
   */
  const authCoursePage = await apiService.get(courseUrl, undefined, authHeaders).then(parseAxiosResponseToDoc);

  await downloadExercises(authCoursePage, downloadFolderPath);
  await downloadSubtitles(videosList, courseUrl, downloadFolderPath);
}

function formatVideosListForDisplay(videos: Video[]): string {
  return `\nFound ${videos.length} videos:\n\n${videos.map(({ title }, index) => `${++index}. ${title}.`).join('\n')}`;
}
